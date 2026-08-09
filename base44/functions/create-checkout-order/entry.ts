import { createClientFromRequest } from "npm:@base44/sdk";

const SHIPPING_THRESHOLD = 15000;
const SHIPPING_COST = 500;
const GIFT_WRAP_COST = 299;

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status });

const clean = (value: unknown) => String(value || "").trim();

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const createOrderNumber = () =>
  `PK${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;

const getProductId = (item: Record<string, unknown>) =>
  clean(item.product_id || item.productId || item.id);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const base44 = createClientFromRequest(req);
    const { order } = await req.json().catch(() => ({}));

    if (!order || typeof order !== "object") {
      return json({ error: "Order details are required." }, 400);
    }

    const input = order as Record<string, any>;
    const email = clean(input.customer_email).toLowerCase();
    const name = clean(input.customer_name);
    const phone = clean(input.customer_phone);
    const items = Array.isArray(input.items) ? input.items : [];
    const address = input.shipping_address || {};

    if (!isValidEmail(email)) return json({ error: "A valid customer email is required." }, 400);
    if (name.length < 2) return json({ error: "A customer name is required." }, 400);
    if (phone.replace(/\D/g, "").length < 8) return json({ error: "A valid customer phone number is required." }, 400);
    if (!items.length) return json({ error: "The order must contain at least one product." }, 400);
    if (items.length > 40) return json({ error: "The order contains too many line items." }, 400);
    if (
      clean(address.address_line_1).length < 4 ||
      clean(address.city).length < 2 ||
      clean(address.country || "India").length < 2
    ) {
      return json({ error: "A complete shipping address is required." }, 400);
    }

    const lines: Array<Record<string, unknown>> = [];
    let subtotal = 0;

    for (const rawItem of items) {
      const item = rawItem as Record<string, unknown>;
      const productId = getProductId(item);
      if (!productId) return json({ error: "A product in your bag is missing its catalogue id." }, 400);

      const product = await base44.asServiceRole.entities.Product.get(productId).catch(() => null);
      if (!product) return json({ error: "A product in your bag is no longer available." }, 404);

      const price = Number(product.price);
      if (!Number.isFinite(price) || price <= 0) {
        return json({ error: "A product has an invalid catalogue price." }, 400);
      }

      const quantity = Math.max(1, Math.min(25, Number(item.quantity) || 1));
      const stock = Number(product.stock_quantity ?? product.stock);
      const hasStock = Number.isFinite(stock);
      const madeToOrder = Boolean(product.made_to_order);
      if (!madeToOrder && hasStock && stock < quantity) {
        return json({ error: `${product.title || "This product"} does not have enough stock for this order.` }, 409);
      }

      subtotal += price * quantity;
      lines.push({
        product_id: product.id || productId,
        title: product.title || clean(item.title) || "Order item",
        price,
        quantity,
        size: clean(item.size) || undefined,
        color: clean(item.color) || undefined,
        image: product.image || product.images?.[0] || clean(item.image) || undefined,
      });
    }

    const giftWrapping = Boolean(input.gift_wrapping);
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping + (giftWrapping ? GIFT_WRAP_COST : 0);
    const paymentMethod = clean(input.payment_method || "whatsapp_order").toLowerCase();

    if (!["manual_upi", "whatsapp_order", "cod"].includes(paymentMethod)) {
      return json({ error: "This payment method is not supported for this checkout backend." }, 400);
    }

    const created = await base44.asServiceRole.entities.Order.create({
      order_number: createOrderNumber(),
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      status: "pending",
      items: lines,
      subtotal,
      shipping,
      discount: 0,
      total,
      coupon_code: "",
      shipping_address: {
        ...address,
        full_name: name,
        email,
        phone,
        country: clean(address.country) || "India",
      },
      payment_method: paymentMethod,
      payment_status: "pending",
      payment_details: input.payment_details || null,
      gift_wrapping: giftWrapping,
      gift_message: clean(input.gift_message).slice(0, 500),
    });

    return json({ success: true, order: created });
  } catch (error) {
    console.error("create-checkout-order failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to create checkout order" }, 500);
  }
});

import { createClientFromRequest } from "npm:@base44/sdk";

const BRAND_NAME = "Poshkaar Kashmir";
const BRAND_EMAIL_FROM = "Poshkaar Kashmir";
const DEFAULT_ADMIN_NOTIFICATION_EMAIL = "poshkaarkashmirofficial@gmail.com";
const ADMIN_EMAIL_SECRET_KEYS = ["ORDER_NOTIFICATION_EMAIL", "ADMIN_ORDER_EMAIL"];

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const titleCase = (value: unknown) =>
  String(value || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatCurrency = (amount: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatAddress = (address: Record<string, unknown> = {}) =>
  [
    address.address_line_1,
    address.address_line_2,
    [address.city, address.state, address.pincode].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean).map(escapeHtml).join("<br />");

const getCustomerEmail = (order: Record<string, any>) =>
  order.customer_email || order.shipping_address?.email || order.created_by || "";

const getCustomerName = (order: Record<string, any>) =>
  order.customer_name || order.shipping_address?.full_name || "Customer";

const getCustomerPhone = (order: Record<string, any>) =>
  order.customer_phone || order.shipping_address?.phone || "";

const getAdminNotificationEmail = () => {
  for (const key of ADMIN_EMAIL_SECRET_KEYS) {
    const value = Deno.env.get(key);
    if (value) return value;
  }
  return DEFAULT_ADMIN_NOTIFICATION_EMAIL;
};

const getOrderTone = (order: Record<string, any>) => {
  if (order.payment_method === "whatsapp_order") {
    return {
      subject: `We received your ${BRAND_NAME} WhatsApp order ${order.order_number}`,
      headline: "WhatsApp order received",
      intro: "Thank you for your order. Our team will confirm availability, measurements, payment and delivery on WhatsApp.",
    };
  }

  if (order.payment_method === "manual_upi" || order.status === "pending") {
    return {
      subject: `We received your ${BRAND_NAME} order ${order.order_number}`,
      headline: "Order received",
      intro: "Thank you for your order. We will confirm it after matching your submitted UPI payment reference.",
    };
  }

  return {
    subject: `Your ${BRAND_NAME} order ${order.order_number} is confirmed`,
    headline: "Order confirmed",
    intro: "Thank you for your order. Our team will prepare your piece with care.",
  };
};

const renderItems = (items: Array<Record<string, any>> = []) =>
  items.map((item) => {
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;

    return `
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid #eadfc9;">
          <strong style="color: #2d2924;">${escapeHtml(item.title || "Order item")}</strong>
          <div style="margin-top: 4px; color: #736858; font-size: 13px;">
            Qty ${quantity}${item.size ? ` · Size ${escapeHtml(item.size)}` : ""}${item.color ? ` · ${escapeHtml(item.color)}` : ""}
          </div>
        </td>
        <td align="right" style="padding: 14px 0; border-bottom: 1px solid #eadfc9; color: #2d2924;">
          ${formatCurrency(price * quantity)}
        </td>
      </tr>
    `;
  }).join("");

const renderCustomerEmail = (order: Record<string, any>) => {
  const tone = getOrderTone(order);
  const orderNumber = escapeHtml(order.order_number || order.id || "your order");
  const paymentLabel = order.payment_method === "whatsapp_order"
    ? "WhatsApp Order"
    : order.payment_method === "cod"
      ? "Legacy Offline Order"
      : titleCase(order.payment_method);

  return `
    <div style="margin:0; padding:0; background:#f8f3ea; font-family: Georgia, 'Times New Roman', serif; color:#2d2924;">
      <div style="max-width:640px; margin:0 auto; padding:34px 18px;">
        <div style="background:#fffaf2; border:1px solid #d8bd78; padding:34px;">
          <p style="margin:0 0 8px; color:#b08a2e; letter-spacing:4px; text-transform:uppercase; font-size:11px;">${BRAND_NAME}</p>
          <h1 style="margin:0; font-size:30px; font-weight:400; color:#2d2924;">${tone.headline}</h1>
          <p style="margin:18px 0 0; line-height:1.7; color:#5f5548;">Dear ${escapeHtml(getCustomerName(order))}, ${tone.intro}</p>

          <div style="margin:28px 0; padding:18px; background:#f8f3ea; border:1px solid #eadfc9;">
            <div style="font-size:12px; color:#8a6a21; letter-spacing:2px; text-transform:uppercase;">Order number</div>
            <div style="margin-top:6px; font-size:22px; color:#2d2924;">${orderNumber}</div>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${renderItems(order.items)}
          </table>

          <div style="margin-top:22px; border-top:1px solid #eadfc9; padding-top:18px;">
            <p style="margin:0 0 8px; display:flex; justify-content:space-between;"><span>Subtotal</span><strong>${formatCurrency(order.subtotal)}</strong></p>
            <p style="margin:0 0 8px; display:flex; justify-content:space-between;"><span>Shipping</span><strong>${Number(order.shipping) ? formatCurrency(order.shipping) : "Complimentary"}</strong></p>
            <p style="margin:14px 0 0; padding-top:14px; border-top:1px solid #eadfc9; display:flex; justify-content:space-between; font-size:20px;"><span>Total</span><strong>${formatCurrency(order.total)}</strong></p>
          </div>

          <div style="margin-top:28px; padding:18px; background:#fff; border:1px solid #eadfc9;">
            <p style="margin:0 0 10px; color:#8a6a21; letter-spacing:2px; text-transform:uppercase; font-size:12px;">Delivery</p>
            <p style="margin:0; line-height:1.7; color:#5f5548;">${formatAddress(order.shipping_address)}</p>
            <p style="margin:12px 0 0; color:#5f5548;">${escapeHtml(getCustomerPhone(order))}</p>
          </div>

          <p style="margin:24px 0 0; line-height:1.7; color:#5f5548;">
            Payment: <strong>${escapeHtml(paymentLabel)}</strong> · Status: <strong>${escapeHtml(titleCase(order.payment_status))}</strong>
          </p>
          <p style="margin:18px 0 0; line-height:1.7; color:#5f5548;">Estimated delivery after confirmation: 5–7 business days.</p>
          <p style="margin:24px 0 0; line-height:1.7; color:#5f5548;">With warmth,<br />The ${BRAND_NAME} team</p>
        </div>
      </div>
    </div>
  `;
};

const renderAdminEmail = (order: Record<string, any>) => {
  const reference = order.payment_details?.transaction_reference;

  return `
    <div style="font-family: Arial, sans-serif; color:#222; line-height:1.55;">
      <h2>New ${BRAND_NAME} order: ${escapeHtml(order.order_number || order.id)}</h2>
      <p><strong>Customer:</strong> ${escapeHtml(getCustomerName(order))}</p>
      <p><strong>Email:</strong> ${escapeHtml(getCustomerEmail(order))}</p>
      <p><strong>Phone:</strong> ${escapeHtml(getCustomerPhone(order))}</p>
      <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
      <p><strong>Order status:</strong> ${escapeHtml(titleCase(order.status))}</p>
      <p><strong>Payment:</strong> ${escapeHtml(titleCase(order.payment_method))} / ${escapeHtml(titleCase(order.payment_status))}</p>
      ${reference ? `<p><strong>UPI reference:</strong> ${escapeHtml(reference)}</p>` : ""}
      <h3>Items</h3>
      <ul>
        ${(order.items || []).map((item: Record<string, any>) => `<li>${escapeHtml(item.title)} × ${Number(item.quantity) || 1} — ${formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1))}</li>`).join("")}
      </ul>
      <h3>Shipping address</h3>
      <p>${formatAddress(order.shipping_address)}</p>
    </div>
  `;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { orderId, orderNumber, force = false } = body || {};

    if (!orderId) {
      return Response.json({ error: "orderId is required" }, { status: 400 });
    }

    if (force) {
      const user = await base44.auth.me().catch(() => null);
      if (user?.role !== "admin") {
        return Response.json({ error: "Admin access required to resend confirmations" }, { status: 403 });
      }
    }

    const order = await base44.asServiceRole.entities.Order.get(orderId);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (orderNumber && order.order_number && orderNumber !== order.order_number) {
      return Response.json({ error: "Order number does not match order id" }, { status: 409 });
    }

    if (order.confirmation_email_sent_at && !force) {
      return Response.json({
        success: true,
        skipped: true,
        reason: "confirmation_already_sent",
        sentAt: order.confirmation_email_sent_at,
      });
    }

    const customerEmail = getCustomerEmail(order);
    if (!customerEmail) {
      return Response.json({ error: "Order does not include a customer email" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const customerEmailTone = getOrderTone(order);
    await base44.integrations.Core.SendEmail({
      to: customerEmail,
      subject: customerEmailTone.subject,
      body: renderCustomerEmail(order),
      from_name: BRAND_EMAIL_FROM,
    });

    const updateData: Record<string, string> = {
      confirmation_email_sent_at: now,
    };

    const adminEmail = getAdminNotificationEmail();
    let adminNotified = false;
    let adminNotificationError = "";

    if (adminEmail) {
      try {
        await base44.integrations.Core.SendEmail({
          to: adminEmail,
          subject: `New ${BRAND_NAME} order ${order.order_number || order.id}`,
          body: renderAdminEmail(order),
          from_name: BRAND_EMAIL_FROM,
        });
        updateData.admin_notification_sent_at = now;
        adminNotified = true;
      } catch (adminEmailError) {
        adminNotificationError = adminEmailError instanceof Error ? adminEmailError.message : "Admin notification failed";
        console.warn("Customer confirmation sent, but admin notification failed:", adminEmailError);
      }
    }

    try {
      await base44.asServiceRole.entities.Order.update(order.id, updateData);
    } catch (updateError) {
      console.warn("Confirmation email sent, but sent timestamp could not be saved:", updateError);
    }

    return Response.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      sentTo: customerEmail,
      adminNotified,
      adminNotificationError: adminNotificationError || undefined,
      sentAt: now,
    });
  } catch (error) {
    console.error("send-order-confirmation failed:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to send order confirmation" },
      { status: 500 },
    );
  }
});

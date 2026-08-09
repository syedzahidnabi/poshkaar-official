const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-checkout-session",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const serviceFetch = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const razorpayFetch = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error?.description || data?.error?.reason || `Razorpay request failed with ${response.status}`);
  }

  return data;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service environment is not configured." }, 500);
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return json({ error: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required for Razorpay checkout." }, 500);
    }

    const checkoutSession = (req.headers.get("x-checkout-session") || "").trim();
    if (checkoutSession.length < 24 || checkoutSession.length > 160) return json({ error: "A valid checkout session is required." }, 400);

    const { orderId, orderNumber } = await req.json().catch(() => ({}));
    if (!orderId) return json({ error: "orderId is required" }, 400);

    const orders = await serviceFetch(`/rest/v1/orders?select=*&id=eq.${encodeURIComponent(orderId)}&limit=1`);
    const order = orders?.[0];
    if (!order) return json({ error: "Order not found" }, 404);
    if (order.created_by !== checkoutSession) {
      return json({ error: "This checkout session does not own the order." }, 403);
    }
    if (orderNumber && order.order_number && orderNumber !== order.order_number) {
      return json({ error: "Order number does not match order id." }, 409);
    }
    if (order.payment_status === "paid") {
      return json({ error: "This order is already paid." }, 409);
    }

    const amountInPaise = Math.round((Number(order.total) || 0) * 100);
    if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
      return json({ error: "Order total must be at least ₹1 for Razorpay checkout." }, 400);
    }

    const existingRazorpayOrderId = order.payment_details?.razorpay_order_id;
    const existingRazorpayAmount = Number(order.payment_details?.razorpay_amount);
    if (existingRazorpayOrderId && existingRazorpayAmount === amountInPaise) {
      return json({
        success: true,
        reused: true,
        key: razorpayKeyId,
        razorpayOrderId: existingRazorpayOrderId,
        amount: amountInPaise,
        currency: "INR",
        orderId: order.id,
        orderNumber: order.order_number,
      });
    }

    const razorpayOrder = await razorpayFetch("/orders", {
      method: "POST",
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: String(order.order_number || order.id).slice(0, 40),
        notes: {
          internal_order_id: String(order.id),
          order_number: String(order.order_number || ""),
          customer_email: String(order.customer_email || ""),
        },
      }),
    });

    await serviceFetch(`/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        payment_method: "razorpay",
        payment_status: "pending",
        status: "pending",
        payment_details: {
          ...(order.payment_details || {}),
          provider: "razorpay",
          razorpay_order_id: razorpayOrder.id,
          razorpay_order_status: razorpayOrder.status,
          razorpay_amount: amountInPaise,
          currency: "INR",
          created_at: new Date().toISOString(),
        },
      }),
    });

    return json({
      success: true,
      key: razorpayKeyId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (error) {
    console.error("create-razorpay-order failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to create Razorpay order" }, 500);
  }
});

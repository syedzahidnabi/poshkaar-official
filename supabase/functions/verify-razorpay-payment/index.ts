const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-checkout-session",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

const encoder = new TextEncoder();

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

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
};

const verifySignature = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(razorpayKeySecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${razorpayOrderId}|${razorpayPaymentId}`),
  );
  return timingSafeEqual(toHex(signed), String(razorpaySignature || "").toLowerCase());
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service environment is not configured." }, 500);
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return json({ error: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required for Razorpay verification." }, 500);
    }

    const checkoutSession = (req.headers.get("x-checkout-session") || "").trim();
    if (checkoutSession.length < 24 || checkoutSession.length > 160) return json({ error: "A valid checkout session is required." }, 400);

    const {
      orderId,
      orderNumber,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = await req.json().catch(() => ({}));

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return json({ error: "orderId, razorpay_order_id, razorpay_payment_id, and razorpay_signature are required." }, 400);
    }

    const orders = await serviceFetch(`/rest/v1/orders?select=*&id=eq.${encodeURIComponent(orderId)}&limit=1`);
    const order = orders?.[0];
    if (!order) return json({ error: "Order not found" }, 404);
    if (order.created_by !== checkoutSession) {
      return json({ error: "This checkout session does not own the order." }, 403);
    }
    if (orderNumber && order.order_number && orderNumber !== order.order_number) {
      return json({ error: "Order number does not match order id." }, 409);
    }

    const expectedRazorpayOrderId = order.payment_details?.razorpay_order_id;
    if (expectedRazorpayOrderId && expectedRazorpayOrderId !== razorpayOrderId) {
      return json({ error: "Razorpay order id does not match this order." }, 409);
    }

    const signatureIsValid = await verifySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!signatureIsValid) {
      return json({ error: "Razorpay payment signature is invalid." }, 400);
    }

    const payment = await razorpayFetch(`/payments/${encodeURIComponent(razorpayPaymentId)}`);
    const expectedAmount = Math.round((Number(order.total) || 0) * 100);
    if (payment.order_id !== razorpayOrderId) {
      return json({ error: "Payment belongs to a different Razorpay order." }, 409);
    }
    if (Number(payment.amount) !== expectedAmount) {
      return json({ error: "Payment amount does not match order total." }, 409);
    }

    const isPaid = payment.status === "captured" || payment.captured === true;
    if (!isPaid) {
      return json({
        success: false,
        error: `Razorpay reports the payment as ${payment.status || "pending"}.`,
        paymentStatus: "pending",
        status: "pending",
      }, 409);
    }

    const confirmation = await serviceFetch("/rest/v1/rpc/confirm_razorpay_payment", {
      method: "POST",
      body: JSON.stringify({
        p_order_id: order.id,
        p_provider_order_id: razorpayOrderId,
        p_provider_payment_id: razorpayPaymentId,
        p_amount: Number(payment.amount) / 100,
        p_details: {
          provider: "razorpay",
          verified_at: new Date().toISOString(),
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_payment_status: payment.status,
          razorpay_amount: payment.amount,
          razorpay_currency: payment.currency,
          razorpay_method: payment.method,
          razorpay_fee: payment.fee,
          razorpay_tax: payment.tax,
        },
      }),
    });

    return json({
      ...(confirmation || {}),
      success: true,
      paymentId: razorpayPaymentId,
      paymentStatus: confirmation?.paymentStatus || "paid",
      status: confirmation?.status || "confirmed",
    });
  } catch (error) {
    console.error("verify-razorpay-payment failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to verify Razorpay payment" }, 500);
  }
});

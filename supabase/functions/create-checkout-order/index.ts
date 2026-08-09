const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-checkout-session",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service environment is not configured." }, 500);
    }

    const checkoutSession = (req.headers.get("x-checkout-session") || "").trim();
    if (checkoutSession.length < 24 || checkoutSession.length > 160) {
      return json({ error: "A valid checkout session is required. Refresh the page and try again." }, 400);
    }

    const { order } = await req.json().catch(() => ({}));
    if (!order || typeof order !== "object") {
      return json({ error: "Order details are required." }, 400);
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_checkout_order`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_order: order,
        p_checkout_session: checkoutSession,
      }),
    });

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;
    if (!response.ok) {
      const message = result?.message || result?.error || "The order could not be saved securely.";
      return json({ error: message, code: result?.code }, response.status >= 500 ? 500 : 400);
    }

    return json({ success: true, order: result });
  } catch (error) {
    console.error("create-checkout-order failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to create checkout order" }, 500);
  }
});

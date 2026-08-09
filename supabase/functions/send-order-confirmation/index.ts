const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-checkout-session",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BRAND_NAME = "Poshkaar Kashmir";
const DEFAULT_ADMIN_EMAIL = "poshkaarkashmirofficial@gmail.com";
const DEFAULT_OWNER_WHATSAPP = "916006491824";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Poshkaar Kashmir <orders@poshkaarkashmir.com>";
const adminEmail = Deno.env.get("ORDER_NOTIFICATION_EMAIL") || DEFAULT_ADMIN_EMAIL;
const whatsappWebhookUrl = Deno.env.get("ORDER_WHATSAPP_WEBHOOK_URL") || Deno.env.get("WHATSAPP_NOTIFICATION_WEBHOOK_URL") || "";
const whatsappWebhookSecret = Deno.env.get("ORDER_WHATSAPP_WEBHOOK_SECRET") || Deno.env.get("WHATSAPP_NOTIFICATION_WEBHOOK_SECRET") || "";
const whatsappRecipient = Deno.env.get("ORDER_NOTIFICATION_WHATSAPP") || Deno.env.get("WHATSAPP_NOTIFICATION_PHONE") || DEFAULT_OWNER_WHATSAPP;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

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

const normalizeWhatsAppPhone = (value: unknown) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

const formatCurrency = (amount: unknown) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

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

const getCustomerEmail = (order: Record<string, any>) =>
  order.customer_email || order.shipping_address?.email || order.created_by || "";

const getCustomerName = (order: Record<string, any>) =>
  order.customer_name || order.shipping_address?.full_name || "Customer";

const getCustomerPhone = (order: Record<string, any>) =>
  order.customer_phone || order.shipping_address?.phone || "";

const formatAddress = (address: Record<string, unknown> = {}) =>
  [
    address.address_line_1,
    address.address_line_2,
    [address.city, address.state, address.pincode].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean).map(escapeHtml).join("<br />");

const renderItems = (items: Array<Record<string, any>> = []) =>
  items.map((item) => {
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #eadfc9;">
          <strong style="color:#2d2924;">${escapeHtml(item.title || "Order item")}</strong>
          <div style="margin-top:4px;color:#736858;font-size:13px;">
            Qty ${quantity}${item.size ? ` &middot; Size ${escapeHtml(item.size)}` : ""}${item.color ? ` &middot; ${escapeHtml(item.color)}` : ""}
          </div>
        </td>
        <td align="right" style="padding:14px 0;border-bottom:1px solid #eadfc9;color:#2d2924;">
          ${formatCurrency(price * quantity)}
        </td>
      </tr>
    `;
  }).join("");

const renderCustomerEmail = (order: Record<string, any>) => {
  const orderNumber = escapeHtml(order.order_number || order.id || "your order");
  const isWhatsappOrder = order.payment_method === "whatsapp_order";
  const isPending = !isWhatsappOrder && (order.payment_method === "manual_upi" || order.status === "pending");
  const headline = isWhatsappOrder ? "WhatsApp order received" : isPending ? "Order received" : "Order confirmed";
  const intro = isWhatsappOrder
    ? "Thank you for your order. Our team will confirm availability, measurements, payment and delivery on WhatsApp."
    : isPending
    ? "Thank you for your order. We will confirm it after matching your submitted payment reference."
    : "Thank you for your order. Our team will prepare your piece with care.";

  return `
    <div style="margin:0;padding:0;background:#f8f3ea;font-family:Georgia,'Times New Roman',serif;color:#2d2924;">
      <div style="max-width:640px;margin:0 auto;padding:34px 18px;">
        <div style="background:#fffaf2;border:1px solid #d8bd78;padding:34px;">
          <p style="margin:0 0 8px;color:#b08a2e;letter-spacing:4px;text-transform:uppercase;font-size:11px;">${BRAND_NAME}</p>
          <h1 style="margin:0;font-size:30px;font-weight:400;color:#2d2924;">${headline}</h1>
          <p style="margin:18px 0 0;line-height:1.7;color:#5f5548;">Dear ${escapeHtml(getCustomerName(order))}, ${intro}</p>
          <div style="margin:28px 0;padding:18px;background:#f8f3ea;border:1px solid #eadfc9;">
            <div style="font-size:12px;color:#8a6a21;letter-spacing:2px;text-transform:uppercase;">Order number</div>
            <div style="margin-top:6px;font-size:22px;color:#2d2924;">${orderNumber}</div>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${renderItems(order.items)}</table>
          <div style="margin-top:22px;border-top:1px solid #eadfc9;padding-top:18px;">
            <p style="margin:0 0 8px;display:flex;justify-content:space-between;"><span>Subtotal</span><strong>${formatCurrency(order.subtotal)}</strong></p>
            <p style="margin:0 0 8px;display:flex;justify-content:space-between;"><span>Shipping</span><strong>${Number(order.shipping) ? formatCurrency(order.shipping) : "Complimentary"}</strong></p>
            <p style="margin:14px 0 0;padding-top:14px;border-top:1px solid #eadfc9;display:flex;justify-content:space-between;font-size:20px;"><span>Total</span><strong>${formatCurrency(order.total)}</strong></p>
          </div>
          <div style="margin-top:28px;padding:18px;background:#fff;border:1px solid #eadfc9;">
            <p style="margin:0 0 10px;color:#8a6a21;letter-spacing:2px;text-transform:uppercase;font-size:12px;">Delivery</p>
            <p style="margin:0;line-height:1.7;color:#5f5548;">${formatAddress(order.shipping_address)}</p>
            <p style="margin:12px 0 0;color:#5f5548;">${escapeHtml(getCustomerPhone(order))}</p>
          </div>
          <p style="margin:24px 0 0;line-height:1.7;color:#5f5548;">Payment: <strong>${escapeHtml(titleCase(order.payment_method))}</strong> &middot; Status: <strong>${escapeHtml(titleCase(order.payment_status))}</strong></p>
          <p style="margin:18px 0 0;line-height:1.7;color:#5f5548;">Estimated delivery after confirmation: 5&ndash;7 business days.</p>
          <p style="margin:24px 0 0;line-height:1.7;color:#5f5548;">With warmth,<br />The ${BRAND_NAME} team</p>
        </div>
      </div>
    </div>
  `;
};

const renderAdminEmail = (order: Record<string, any>) => `
  <div style="font-family:Arial,sans-serif;color:#222;line-height:1.55;">
    <h2>New ${BRAND_NAME} order: ${escapeHtml(order.order_number || order.id)}</h2>
    <p><strong>Customer:</strong> ${escapeHtml(getCustomerName(order))}</p>
    <p><strong>Email:</strong> ${escapeHtml(getCustomerEmail(order))}</p>
    <p><strong>Phone:</strong> ${escapeHtml(getCustomerPhone(order))}</p>
    <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
    <p><strong>Order status:</strong> ${escapeHtml(titleCase(order.status))}</p>
    <p><strong>Payment:</strong> ${escapeHtml(titleCase(order.payment_method))} / ${escapeHtml(titleCase(order.payment_status))}</p>
    ${order.payment_details?.transaction_reference ? `<p><strong>UPI reference:</strong> ${escapeHtml(order.payment_details.transaction_reference)}</p>` : ""}
    <h3>Items</h3>
    <ul>${(order.items || []).map((item: Record<string, any>) => `<li>${escapeHtml(item.title)} &times; ${Number(item.quantity) || 1} &mdash; ${formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1))}</li>`).join("")}</ul>
    <h3>Shipping address</h3>
    <p>${formatAddress(order.shipping_address)}</p>
  </div>
`;

const renderOwnerWhatsAppText = (order: Record<string, any>) => {
  const items = (order.items || [])
    .map((item: Record<string, any>) => `${Number(item.quantity) || 1} x ${item.title || "Order item"}`)
    .join(", ");

  return [
    `New ${BRAND_NAME} order`,
    `Order: ${order.order_number || order.id}`,
    `Customer: ${getCustomerName(order)}`,
    `Phone: ${getCustomerPhone(order) || "Not added"}`,
    `Total: ${formatCurrency(order.total)}`,
    `Payment: ${titleCase(order.payment_method)} / ${titleCase(order.payment_status)}`,
    items ? `Items: ${items}` : "",
  ].filter(Boolean).join("\n");
};

const renderCustomerWhatsAppText = (order: Record<string, any>) => {
  const items = (order.items || [])
    .map((item: Record<string, any>) => `${Number(item.quantity) || 1} x ${item.title || "Order item"}`)
    .join(", ");
  const isWhatsappOrder = order.payment_method === "whatsapp_order";

  return [
    `Thank you for your ${BRAND_NAME} order.`,
    `Order: ${order.order_number || order.id}`,
    `Total: ${formatCurrency(order.total)}`,
    `Payment: ${titleCase(order.payment_method)} / ${titleCase(order.payment_status)}`,
    items ? `Items: ${items}` : "",
    isWhatsappOrder
      ? "Please keep this chat open. Our team will confirm availability, measurements, payment and delivery."
      : "We have received your order. We will notify you when it is ready to ship.",
  ].filter(Boolean).join("\n");
};

const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured for order emails.");
  }

  if (resendApiKey === "your_resend_api_key") {
    throw new Error("RESEND_API_KEY is still the placeholder value. Create a real Resend API key and set that secret in Supabase.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromEmail, to, subject, html }),
  });

  if (!response.ok) {
    const rawError = await response.text();
    let message = rawError;
    try {
      const parsed = JSON.parse(rawError);
      message = parsed?.message || parsed?.error || rawError;
    } catch {
      message = rawError;
    }

    if (response.status === 401 || /api key is invalid/i.test(message)) {
      throw new Error("Resend rejected RESEND_API_KEY. Add a real Resend API key in Supabase secrets, then redeploy this function.");
    }

    throw new Error(message);
  }

  return response.json();
};

const postWhatsAppNotification = async ({
  type,
  to,
  text,
  order,
}: {
  type: string;
  to: string;
  text: string;
  order: Record<string, any>;
}) => {
  const normalizedTo = normalizeWhatsAppPhone(to);
  if (!normalizedTo) {
    return { enabled: Boolean(whatsappWebhookUrl), sent: false, reason: "missing_phone" };
  }

  const body = {
    type,
    channel: "whatsapp",
    to: normalizedTo,
    text,
    order: {
      id: order.id,
      order_number: order.order_number,
      customer_name: getCustomerName(order),
      customer_email: getCustomerEmail(order),
      customer_phone: getCustomerPhone(order),
      total: order.total,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      items: order.items || [],
      shipping_address: order.shipping_address || {},
      created_date: order.created_date,
    },
  };

  const response = await fetch(whatsappWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(whatsappWebhookSecret ? { Authorization: `Bearer ${whatsappWebhookSecret}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return { enabled: true, sent: true, to: normalizedTo };
};

const sendWhatsAppNotifications = async (
  order: Record<string, any>,
  options: { sendOwner?: boolean; sendCustomer?: boolean } = {},
) => {
  if (!whatsappWebhookUrl) {
    return { enabled: false, ownerSent: false, customerSent: false };
  }

  const result = {
    enabled: true,
    ownerSent: false,
    customerSent: false,
    ownerTo: normalizeWhatsAppPhone(whatsappRecipient),
    customerTo: normalizeWhatsAppPhone(getCustomerPhone(order)),
  };

  if (options.sendOwner) {
    const ownerResult = await postWhatsAppNotification({
      type: "new_order_owner_notification",
      to: whatsappRecipient,
      text: renderOwnerWhatsAppText(order),
      order,
    });
    result.ownerSent = Boolean(ownerResult.sent);
  }

  if (options.sendCustomer) {
    const customerResult = await postWhatsAppNotification({
      type: "order_confirmation_customer",
      to: getCustomerPhone(order),
      text: renderCustomerWhatsAppText(order),
      order,
    });
    result.customerSent = Boolean(customerResult.sent);
  }

  return result;
};

const isAdminRequest = async (req: Request) => {
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return false;

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: authHeader,
    },
  });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  const email = String(user.email || "").toLowerCase();
  if (email === DEFAULT_ADMIN_EMAIL) return true;

  const rows = await serviceFetch(`/rest/v1/admin_users?select=email&email=eq.${encodeURIComponent(email)}&limit=1`);
  return Boolean(rows?.length);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service environment is not configured." }, 500);
    }

    const { orderId, orderNumber, force = false } = await req.json().catch(() => ({}));
    if (!orderId && !orderNumber) return json({ error: "orderId or orderNumber is required" }, 400);
    const adminRequest = await isAdminRequest(req);
    if (force && !adminRequest) {
      return json({ error: "Admin access required to resend confirmations." }, 403);
    }

    const orderLookup = orderId
      ? `id=eq.${encodeURIComponent(String(orderId))}`
      : `order_number=eq.${encodeURIComponent(String(orderNumber))}`;
    const orders = await serviceFetch(`/rest/v1/orders?select=*&${orderLookup}&limit=1`);
    const order = orders?.[0];
    if (!order) return json({ error: "Order not found" }, 404);
    if (orderNumber && order.order_number && orderNumber !== order.order_number) {
      return json({ error: "Order number does not match order id." }, 409);
    }

    const checkoutSession = (req.headers.get("x-checkout-session") || "").trim();
    if (!adminRequest && (checkoutSession.length < 24 || checkoutSession.length > 160 || order.created_by !== checkoutSession)) {
      return json({ error: "This checkout session does not own the order." }, 403);
    }

    const customerEmail = getCustomerEmail(order);
    const shouldSendCustomer = force || !order.confirmation_email_sent_at;
    const shouldSendAdmin = force || !order.admin_notification_sent_at;
    const ownerWhatsappAlreadySent = Boolean(order.owner_whatsapp_notification_sent_at || order.whatsapp_notification_sent_at);
    const customerWhatsappAlreadySent = Boolean(order.customer_whatsapp_notification_sent_at);
    const shouldSendOwnerWhatsapp = Boolean(whatsappWebhookUrl) && (force || !ownerWhatsappAlreadySent);
    const shouldSendCustomerWhatsapp = Boolean(whatsappWebhookUrl) && (force || !customerWhatsappAlreadySent);
    const shouldSendWhatsapp = shouldSendOwnerWhatsapp || shouldSendCustomerWhatsapp;

    if (!shouldSendCustomer && !shouldSendAdmin && !shouldSendWhatsapp) {
      return json({
        success: true,
        skipped: true,
        reason: "all_notifications_already_sent",
        orderId: order.id,
        orderNumber: order.order_number,
        sentTo: customerEmail,
        customerNotified: false,
        adminNotified: false,
        whatsappNotified: false,
        ownerWhatsappNotified: false,
        customerWhatsappNotified: false,
        whatsappConfigured: Boolean(whatsappWebhookUrl),
      });
    }

    const now = new Date().toISOString();
    let customerNotified = false;
    let adminNotified = false;
    let ownerWhatsappNotified = false;
    let customerWhatsappNotified = false;
    const notificationErrors: Record<string, string> = {};

    if (shouldSendCustomer) {
      if (!customerEmail) {
        notificationErrors.customer = "Order does not include a customer email.";
      } else {
        try {
          await sendEmail({
            to: customerEmail,
            subject: `${BRAND_NAME} order ${order.order_number || order.id}`,
            html: renderCustomerEmail(order),
          });
          customerNotified = true;
        } catch (error) {
          console.warn("Customer confirmation failed:", error);
          notificationErrors.customer = error instanceof Error ? error.message : "Customer confirmation failed";
        }
      }
    }

    try {
      if (shouldSendAdmin) {
        await sendEmail({
          to: adminEmail,
          subject: `New ${BRAND_NAME} order ${order.order_number || order.id}`,
          html: renderAdminEmail(order),
        });
        adminNotified = true;
      }
    } catch (error) {
      console.warn("Admin notification failed:", error);
      notificationErrors.admin = error instanceof Error ? error.message : "Admin notification failed";
    }

    try {
      if (shouldSendWhatsapp) {
        const whatsappResult = await sendWhatsAppNotifications(order, {
          sendOwner: shouldSendOwnerWhatsapp,
          sendCustomer: shouldSendCustomerWhatsapp,
        });
        ownerWhatsappNotified = Boolean(whatsappResult.ownerSent);
        customerWhatsappNotified = Boolean(whatsappResult.customerSent);
      }
    } catch (error) {
      console.warn("WhatsApp notification failed:", error);
      notificationErrors.whatsapp = error instanceof Error ? error.message : "WhatsApp notification failed";
    }

    const timestampPatch = {
      ...(customerNotified ? { confirmation_email_sent_at: now } : {}),
      ...(adminNotified ? { admin_notification_sent_at: now } : {}),
      ...(ownerWhatsappNotified ? { whatsapp_notification_sent_at: now, owner_whatsapp_notification_sent_at: now } : {}),
      ...(customerWhatsappNotified ? { customer_whatsapp_notification_sent_at: now } : {}),
    };

    if (Object.keys(timestampPatch).length) {
      await serviceFetch(`/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}`, {
        method: "PATCH",
        body: JSON.stringify(timestampPatch),
      });
    }

    return json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      sentTo: customerEmail,
      customerNotified,
      adminNotified,
      whatsappNotified: ownerWhatsappNotified || customerWhatsappNotified,
      ownerWhatsappNotified,
      customerWhatsappNotified,
      whatsappConfigured: Boolean(whatsappWebhookUrl),
      alreadySent: {
        customer: Boolean(order.confirmation_email_sent_at) && !customerNotified,
        admin: Boolean(order.admin_notification_sent_at) && !adminNotified,
        whatsapp: ownerWhatsappAlreadySent && customerWhatsappAlreadySent && !(ownerWhatsappNotified || customerWhatsappNotified),
        ownerWhatsapp: ownerWhatsappAlreadySent && !ownerWhatsappNotified,
        customerWhatsapp: customerWhatsappAlreadySent && !customerWhatsappNotified,
      },
      errors: notificationErrors,
      sentAt: now,
    });
  } catch (error) {
    console.error("send-order-confirmation failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unable to send order confirmation" }, 500);
  }
});

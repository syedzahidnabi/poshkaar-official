import { NextResponse } from "next/server";
import { products } from "@/data/products";

type OrderRequest = {
  items?: Array<{
    productId?: string;
    quantity?: number;
    color?: string;
  }>;
  receipt?: string;
  notes?: Record<string, string>;
};

function parsePrice(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

function getRazorpayAuth() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return {
    keyId,
    authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString(
      "base64"
    )}`,
  };
}

function cleanNotes(notes?: Record<string, string>) {
  if (!notes) return undefined;

  return Object.fromEntries(
    Object.entries(notes)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => [key, String(value).slice(0, 240)])
  );
}

function buildServerCart(items: OrderRequest["items"]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  return items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1));

    if (!product) {
      throw new Error("A cart item is no longer available.");
    }

    if (product.stockStatus === "sold-out") {
      throw new Error(`${product.name} is sold out.`);
    }

    return {
      product,
      quantity,
      color: item.color,
      unitPrice: parsePrice(product.price),
    };
  });
}

function getTotals(cart: ReturnType<typeof buildServerCart>) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discount = itemCount >= 2 ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount);

  return { subtotal, discount, total, itemCount };
}

function buildItemNote(cart: ReturnType<typeof buildServerCart>) {
  return cart
    .map((item) => {
      const color = item.color ? `, ${item.color}` : "";
      return `${item.quantity} x ${item.product.name}${color}`;
    })
    .join("; ")
    .slice(0, 240);
}

export async function POST(request: Request) {
  const auth = getRazorpayAuth();

  if (!auth) {
    return NextResponse.json(
      {
        error:
          "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      },
      { status: 503 }
    );
  }

  let body: OrderRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let cart: ReturnType<typeof buildServerCart>;

  try {
    cart = buildServerCart(body.items);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to validate cart.",
      },
      { status: 400 }
    );
  }

  const totals = getTotals(cart);

  if (!Number.isFinite(totals.total) || totals.total <= 0) {
    return NextResponse.json(
      { error: "A valid positive order total is required." },
      { status: 400 }
    );
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: auth.authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(totals.total * 100),
      currency: "INR",
      receipt: (body.receipt || `poshkaar_${Date.now()}`).slice(0, 40),
      notes: cleanNotes({
        ...body.notes,
        items: buildItemNote(cart),
        subtotal: String(totals.subtotal),
        discount: String(totals.discount),
      }),
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: payload?.error?.description || "Unable to create order." },
      { status: response.status }
    );
  }

  return NextResponse.json({
    id: payload.id,
    amount: payload.amount,
    currency: payload.currency,
    keyId: auth.keyId,
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
  });
}

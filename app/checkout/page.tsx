"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useCart, type CartItem } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/price";
import { whatsappNumber } from "@/data/commerce";

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  keyId: string;
  total: number;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

const initialForm: CheckoutForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

const razorpayScriptId = "razorpay-checkout-script";

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const existing = document.getElementById(
      razorpayScriptId
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = razorpayScriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function fieldLabel(name: keyof CheckoutForm) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function buildItemSummary(items: CartItem[]) {
  return items
    .map((item) => {
      const color = item.color ? `, ${item.color}` : "";
      return `${item.quantity} x ${item.name}${color}`;
    })
    .join("; ")
    .slice(0, 240);
}

function buildWhatsAppMessage({
  form,
  items,
  total,
  orderRef,
}: {
  form: CheckoutForm;
  items: CartItem[];
  total: number;
  orderRef: string;
}) {
  const lines = [
    "Hello Poshkaar",
    "",
    `I would like to place order ${orderRef}.`,
    "",
    "Items:",
    ...items.map((item) => {
      const color = item.color ? ` (${item.color})` : "";
      return `- ${item.quantity} x ${item.name}${color}`;
    }),
    "",
    `Total: ${formatCurrency(total)}`,
    "",
    "Customer:",
    form.fullName ? `Name: ${form.fullName}` : "",
    form.phone ? `Phone: ${form.phone}` : "",
    form.email ? `Email: ${form.email}` : "",
    form.address
      ? `Address: ${form.address}, ${form.city}, ${form.state} ${form.pincode}`
      : "",
    form.notes ? `Notes: ${form.notes}` : "",
    "",
    "Please confirm availability and delivery timeline.",
  ];

  return lines.filter(Boolean).join("\n");
}

async function createRazorpayOrder({
  orderRef,
  form,
  items,
}: {
  orderRef: string;
  form: CheckoutForm;
  items: CartItem[];
}) {
  const response = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      receipt: orderRef,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
      })),
      notes: {
        orderRef,
        customer: form.fullName,
        phone: form.phone,
        requestedItems: buildItemSummary(items),
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "Could not create Razorpay order.");
  }

  return payload as RazorpayOrder;
}

export default function CheckoutPage() {
  const { items, isLoaded, subtotal, discount, total, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [message, setMessage] = useState("");
  const [paymentState, setPaymentState] = useState<
    "idle" | "creating" | "verifying"
  >("idle");
  const [confirmation, setConfirmation] = useState<{
    orderRef: string;
    paymentId: string;
  } | null>(null);

  const orderRef = useMemo(
    () => `PK-${Date.now().toString(36).toUpperCase()}`,
    []
  );
  const upiId = process.env.NEXT_PUBLIC_POSHKAAR_UPI_ID;
  const formReady = Boolean(
    form.fullName.trim() &&
      form.phone.trim() &&
      form.address.trim() &&
      form.city.trim() &&
      form.pincode.trim()
  );
  const whatsappUrl = useMemo(() => {
    const text = buildWhatsAppMessage({ form, items, total, orderRef });
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [form, items, orderRef, total]);

  const updateForm = (name: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleUpiPayment = () => {
    if (!formReady) {
      setMessage("Please fill in your delivery details before payment.");
      return;
    }

    if (!upiId) {
      setMessage(
        "UPI payments are ready, but NEXT_PUBLIC_POSHKAAR_UPI_ID is not configured."
      );
      return;
    }

    const params = new URLSearchParams({
      pa: upiId,
      pn: "Poshkaar Kashmir",
      am: total.toString(),
      cu: "INR",
      tn: `Poshkaar order ${orderRef}`,
    });

    window.location.href = `upi://pay?${params.toString()}`;
  };

  const handleRazorpayPayment = async () => {
    if (!formReady) {
      setMessage("Please fill in your delivery details before payment.");
      return;
    }

    setMessage("");
    setPaymentState("creating");

    try {
      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        throw new Error("Razorpay Checkout could not be loaded.");
      }

      const order = await createRazorpayOrder({
        orderRef,
        form,
        items,
      });

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Poshkaar Kashmir",
        description: `Order ${orderRef}`,
        image: "/logo.png",
        order_id: order.id,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          orderRef,
          customer: form.fullName,
        },
        theme: {
          color: "#8a1538",
        },
        handler: async (response) => {
          setPaymentState("verifying");

          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyPayload = await verifyResponse.json();

          if (!verifyResponse.ok || !verifyPayload.verified) {
            throw new Error(
              verifyPayload?.error || "Payment verification failed."
            );
          }

          setConfirmation({
            orderRef,
            paymentId: response.razorpay_payment_id,
          });
          clearCart();
          setPaymentState("idle");
        },
        modal: {
          ondismiss: () => setPaymentState("idle"),
        },
      });

      checkout.open();
    } catch (error) {
      setPaymentState("idle");
      setMessage(
        error instanceof Error
          ? error.message
          : "Payment could not be started. Please try again."
      );
    }
  };

  if (confirmation) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-16 text-[#171412]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-md bg-green-100 text-green-700">
            <ShieldCheck className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-4xl font-bold">Payment verified</h1>
          <p className="mt-4 text-gray-700">
            Your order reference is{" "}
            <span className="font-semibold">{confirmation.orderRef}</span>.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Razorpay payment ID: {confirmation.paymentId}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/collection"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#171412] px-5 text-sm font-bold text-white transition hover:bg-[#8a1538]"
            >
              Continue shopping
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-green-600 px-5 text-sm font-bold text-green-700 transition hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Share on WhatsApp
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-16">
        <div className="mx-auto max-w-6xl text-center text-gray-600">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-16 text-center text-[#171412]">
        <h1 className="font-serif text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-gray-600">
          Add pieces to your cart before starting checkout.
        </p>
        <Link
          href="/collection"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#171412] px-5 text-sm font-bold text-white transition hover:bg-[#8a1538]"
        >
          Explore collections
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-12 text-[#171412]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#8a1538] hover:text-[#171412]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to cart
        </Link>

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase text-[#8a1538]">
            Secure checkout
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold">
            Complete your order
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/10">
            <h2 className="font-serif text-2xl font-bold">Delivery details</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(Object.keys(initialForm) as Array<keyof CheckoutForm>).map(
                (name) => {
                  const isWide = name === "address" || name === "notes";
                  const required =
                    name === "fullName" ||
                    name === "phone" ||
                    name === "address" ||
                    name === "city" ||
                    name === "pincode";

                  return (
                    <label
                      key={name}
                      className={isWide ? "md:col-span-2" : undefined}
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        {fieldLabel(name)}
                        {required ? " *" : ""}
                      </span>
                      {isWide ? (
                        <textarea
                          value={form[name]}
                          onChange={(event) =>
                            updateForm(name, event.target.value)
                          }
                          rows={name === "address" ? 3 : 2}
                          className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
                        />
                      ) : (
                        <input
                          value={form[name]}
                          onChange={(event) =>
                            updateForm(name, event.target.value)
                          }
                          type={
                            name === "email"
                              ? "email"
                              : name === "phone" || name === "pincode"
                              ? "tel"
                              : "text"
                          }
                          className="mt-2 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
                        />
                      )}
                    </label>
                  );
                }
              )}
            </div>

            <div className="mt-8 rounded-md bg-[#f7f4ef] p-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 text-[#0f6f68]" aria-hidden="true" />
                <p>
                  Payment opens through Razorpay or your UPI app. Poshkaar
                  confirms availability, custom measurements and delivery timing
                  before dispatch.
                </p>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/10">
            <h2 className="font-serif text-2xl font-bold">Order summary</h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[64px_1fr] gap-3 border-b border-black/10 pb-4 last:border-b-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#171412]">
                      {item.quantity} x {item.name}
                    </p>
                    {item.color && (
                      <p className="mt-1 text-xs text-gray-500">
                        Colour: {item.color}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-bold text-[#8a1538]">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-black/10 pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Offer discount</span>
                <span className="font-semibold text-green-700">
                  -{formatCurrency(discount)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={paymentState !== "idle"}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#171412] px-5 text-sm font-bold text-white transition hover:bg-[#8a1538] disabled:cursor-wait disabled:bg-gray-400"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                {paymentState === "creating"
                  ? "Starting payment..."
                  : paymentState === "verifying"
                  ? "Verifying..."
                  : "Pay by card or wallet"}
              </button>

              <button
                type="button"
                onClick={handleUpiPayment}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#8a1538] px-5 text-sm font-bold text-white transition hover:bg-[#6f102d]"
              >
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                Pay with UPI
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-green-600 px-5 text-sm font-bold text-green-700 transition hover:bg-green-50"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Order on WhatsApp
              </a>
            </div>

            {message && (
              <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {message}
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

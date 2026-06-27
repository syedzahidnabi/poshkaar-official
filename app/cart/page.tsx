"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/price";

function measurementLines(measurements?: Record<string, string>) {
  if (!measurements) return [];

  return Object.entries(measurements)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")}: ${value}`);
}

export default function CartPage() {
  const {
    items,
    isLoaded,
    itemCount,
    subtotal,
    discount,
    total,
    removeItem,
    updateQuantity,
  } = useCart();

  if (!isLoaded) {
    return (
      <main className="bg-cream min-h-screen px-6 py-16">
        <div className="mx-auto max-w-6xl text-center text-gray-600">
          Loading your cart...
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="bg-cream min-h-screen px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-amber-800 shadow-sm">
            <ShoppingBag className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-amber-950">
            Your cart is empty
          </h1>
          <p className="mt-3 max-w-xl text-gray-600">
            Add handcrafted pieces from the collection and return here to review
            your order before payment.
          </p>
          <Link
            href="/collection"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-amber-700 px-6 text-sm font-semibold text-white transition hover:bg-amber-800"
          >
            Explore Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-amber-700">
              Shopping Bag
            </p>
            <h1 className="mt-2 text-3xl font-serif font-bold text-amber-950 md:text-4xl">
              Review Your Cart
            </h1>
          </div>
          <Link
            href="/collection"
            className="text-sm font-semibold text-amber-800 hover:underline"
          >
            Continue shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            {items.map((item) => {
              const lines = measurementLines(item.measurements);

              return (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-lg border border-amber-100 bg-white p-4 shadow-sm sm:grid-cols-[132px_1fr_auto]"
                >
                  <Link
                    href={`/product/${item.productId}`}
                    className="block aspect-square overflow-hidden rounded-md bg-amber-50"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.productId}`}
                      className="text-lg font-semibold text-gray-950 hover:text-amber-800"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.category.toUpperCase()} Collection
                    </p>
                    {item.color && (
                      <p className="mt-3 text-sm text-gray-700">
                        Colour: <span className="font-medium">{item.color}</span>
                      </p>
                    )}
                    {lines.length > 0 && (
                      <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-gray-700">
                        {lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="font-semibold text-amber-800">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="inline-flex h-9 min-w-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-lg border border-amber-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">{itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Buy 2 offer</span>
                <span className="font-medium text-green-700">
                  -{formatCurrency(discount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Calculated after address</span>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Taxes, final delivery charges and made-to-order timelines are
                confirmed before dispatch.
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber-700 px-6 text-sm font-semibold text-white transition hover:bg-amber-800"
            >
              Checkout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

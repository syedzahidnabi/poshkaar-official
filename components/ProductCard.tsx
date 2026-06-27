"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartProvider";
import { formatCurrency, parsePrice } from "@/lib/price";

function stockLabel(status: Product["stockStatus"]) {
  if (status === "sold-out") return "Sold out";
  if (status === "low-stock") return "Low stock";
  return "Ready to order";
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isSoldOut = product.stockStatus === "sold-out";
  const defaultColor = product.colors?.[0];
  const price = formatCurrency(parsePrice(product.price));

  const addToCart = () => {
    if (isSoldOut) return;

    addItem(product, { color: defaultColor });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#eee8df]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/46 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <span
            className={`absolute left-3 top-3 rounded-md px-3 py-1 text-xs font-bold ${
              isSoldOut
                ? "bg-[#171412] text-white"
                : product.stockStatus === "low-stock"
                ? "bg-[#8a1538] text-white"
                : "bg-white/92 text-[#171412]"
            }`}
          >
            {stockLabel(product.stockStatus)}
          </span>
          <span className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/92 text-[#171412] opacity-0 transition group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block">
          <p className="text-xs font-semibold uppercase text-[#8a1538]">
            {product.workType || product.category}
          </p>
          <h3 className="mt-1 min-h-12 text-lg font-semibold leading-6 text-[#171412] transition group-hover:text-[#8a1538]">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {[product.fabric, product.customMeasurements !== false ? "Custom sizing" : null]
              .filter(Boolean)
              .join(" / ")}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-serif text-xl font-bold text-[#171412]">{price}</p>
          <button
            type="button"
            disabled={isSoldOut}
            onClick={addToCart}
            className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md bg-[#171412] px-3 text-sm font-bold text-white transition hover:bg-[#8a1538] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            aria-label={`Add ${product.name} to cart`}
            title={isSoldOut ? "Unavailable" : "Add to cart"}
          >
            {justAdded ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {justAdded ? "Added" : isSoldOut ? "Out" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

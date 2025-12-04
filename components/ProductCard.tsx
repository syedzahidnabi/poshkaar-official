// components/ProductCard.tsx
"use client";

import Link from "next/link";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden glow-gold cursor-pointer group">
        <div className="relative h-64 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover velvet-depth transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-yellow-200 to-transparent animate-shimmer pointer-events-none" />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gold-700 font-bold mt-1">{product.price}</p>
          <p className="text-sm text-gray-500 mt-1">{product.workType} • {product.fabric}</p>
        </div>
      </div>
    </Link>
  );
}

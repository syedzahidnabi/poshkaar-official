// components/MatchingSet.tsx
"use client";

import React from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function MatchingSet({ productId }: { productId: string }) {
  const item = products.find(p => p.id === productId);
  if (!item) return null;

  const sameSet = products.filter(p => p.matchingSet && p.category === item.category && p.id !== item.id).slice(0, 3);
  if (!sameSet.length) return (
    <div className="bg-white p-4 rounded-lg shadow-sm detail-card">
      <strong>Matching set:</strong> Available on request.
    </div>
  );

  return (
    <div>
      <h4 className="font-medium mb-3">Matching pieces</h4>
      <div className="grid grid-cols-3 gap-3">
        {sameSet.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

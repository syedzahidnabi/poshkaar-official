"use client";

import React, { useMemo, useState } from "react";
import { products, Product } from "@/data/products";

import ProductGallery from "./ProductGallery";
import ColorSelector from "./ColorSelector";
import MeasurementsModal from "./MeasurementsModal";
import WhatsAppOrder from "./WhatsAppOrder";
import ProductCard from "./ProductCard";
import MatchingSet from "./MatchingSet";

type Props = { productId: string };

export default function ProductPageClient({ productId }: Props) {
  const product: Product | null = useMemo(
    () => products.find((p) => p.id === productId) || null,
    [productId]
  );

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  );

  const [measureOpen, setMeasureOpen] = useState(false);
  const [savedMeasurements, setSavedMeasurements] =
    useState<Record<string, string> | null>(null);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-xl font-medium">Product not found</h2>
        <p className="text-sm text-gray-600 mt-2">{productId}</p>
      </div>
    );
  }

  const subtitle = [product.fabric, product.workType]
    .filter(Boolean)
    .join(" • ");

  const related = useMemo(
    () =>
      products
        .filter(
          (p) => p.category === product.category && p.id !== product.id
        )
        .slice(0, 6),
    [product]
  );

  return (
    <div className="bg-cream min-h-screen fade-smooth">
      {/* HERO — FIXED HEIGHT, LUXURY SECTION */}
      <div
        className="
          w-full 
          h-[260px] md:h-[360px] lg:h-[420px]
          relative flex items-center justify-center 
          overflow-hidden rounded-b-3xl
        "
        style={{
          backgroundImage: `url('/images/collections/${product.category}-banner.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/20" />

        <h1
          className="
            relative z-10 
            text-4xl md:text-6xl 
            font-serif font-bold text-amber-900 
            drop-shadow-lg tracking-wide
          "
        >
          {product.name}
        </h1>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT — GALLERY */}
        <div className="w-full max-w-[620px] mx-auto">
          <ProductGallery product={product} selectedColor={selectedColor} />
        </div>

        {/* RIGHT — INFO & STICKY ACTION */}
        <div className="space-y-8 relative">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-900">
              {product.name}
            </h2>

            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-semibold text-amber-700">
                {product.price}
              </p>

              {product.stockStatus === "in-stock" && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                  In stock
                </span>
              )}
              {product.stockStatus === "low-stock" && (
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                  Low stock
                </span>
              )}
              {product.stockStatus === "sold-out" && (
                <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs">
                  Sold out
                </span>
              )}
            </div>

            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}

            {product.colors && (
              <>
                <h4 className="text-sm font-medium mb-2">
                  Available Colours
                </h4>
                <ColorSelector
                  colors={product.colors}
                  selected={selectedColor}
                  onSelect={setSelectedColor}
                />
              </>
            )}

            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* CARE */}
            <div className="bg-white p-4 rounded-lg shadow-sm detail-card">
              <h4 className="font-medium text-gray-800 mb-2">
                Care Instructions
              </h4>
              <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
                <li>Dry clean only.</li>
                <li>
                  Store wrapped in muslin or cotton in a cool, dry place.
                </li>
                <li>
                  Avoid perfumes, deodorants and direct sunlight.
                </li>
              </ul>
            </div>
          </div>

          {/* ACTION PANEL */}
          <div
            className="
              sticky top-6 z-40 bg-white/90 backdrop-blur-lg 
              p-4 rounded-xl shadow-xl border border-amber-100 
              flex flex-col gap-3
            "
          >
            <button
              onClick={() => setMeasureOpen(true)}
              className="px-6 py-3 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-sm font-medium shadow-sm"
            >
              Add Custom Measurements
            </button>

            <WhatsAppOrder
              productName={product.name}
              color={selectedColor}
              measurements={savedMeasurements}
              className="w-full"
            />
          </div>

          {savedMeasurements && (
            <p className="text-sm text-green-700">
              ✓ Measurements saved successfully
            </p>
          )}

          {product.matchingSet && (
            <MatchingSet productId={product.id} />
          )}

          <a
            href={`/collection/${product.category}`}
            className="text-sm text-amber-700 hover:underline"
          >
            ← Back to {product.category.toUpperCase()} Collection
          </a>
        </div>
      </div>

      {/* RELATED */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h3 className="text-2xl font-semibold mb-6">You May Also Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* MODAL */}
      <MeasurementsModal
        open={measureOpen}
        onClose={() => setMeasureOpen(false)}
        product={product}
        onSave={(m) => setSavedMeasurements(m)}
      />
    </div>
  );
}

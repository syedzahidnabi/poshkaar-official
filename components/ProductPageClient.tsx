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

      {/* -------------------------------------------------- */}
      {/* ✨ LUXURY HERO BANNER */}
      {/* -------------------------------------------------- */}
      <div className="relative w-full h-[280px] md:h-[360px] lg:h-[430px] overflow-hidden">
        <img
          src={`/images/collections/${product.category}-banner.jpg`}
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/10 backdrop-blur-[1px]" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
              Poshkaar Kashmir
            </p>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-900 drop-shadow-xl">
              {product.name}
            </h1>

            {subtitle && (
              <p className="text-sm md:text-base text-gray-700 font-light">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* MAIN GRID */}
      {/* -------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT — PRODUCT GALLERY */}
        <div className="w-full max-w-[620px] mx-auto">
          <ProductGallery product={product} selectedColor={selectedColor} />
        </div>

        {/* RIGHT — INFO PANEL */}
        <div className="space-y-10 relative">

          {/* PRODUCT TITLE + PRICE */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center justify-between">
              <p className="text-3xl font-semibold text-amber-700 tracking-wide">
                {product.price}
              </p>

              {product.stockStatus === "in-stock" && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                  In stock
                </span>
              )}
              {product.stockStatus === "low-stock" && (
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs animate-pulse">
                  Low stock
                </span>
              )}
              {product.stockStatus === "sold-out" && (
                <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs">
                  Sold out
                </span>
              )}
            </div>
          </div>

          {/* COLOR SELECTOR */}
          {product.colors && (
            <div>
              <h4 className="text-sm font-medium tracking-wide mb-3 text-amber-800">
                Colour Variants
              </h4>

              <ColorSelector
                colors={product.colors}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif text-amber-900">Description</h4>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>
          </div>

          {/* CARE CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-100 space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <span className="text-amber-700 text-xl">✦</span>
              Care Instructions
            </h4>

            <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
              <li>Dry clean only.</li>
              <li>Store wrapped in soft cotton/muslin.</li>
              <li>Avoid perfume & direct sunlight.</li>
            </ul>
          </div>

          {/* ----------------------------------------------- */}
          {/* STICKY ACTION PANEL (Fixes WhatsApp disappearing) */}
          {/* ----------------------------------------------- */}
          <div className="
            sticky top-6 z-40 
            bg-white/90 backdrop-blur-xl 
            p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            border border-amber-100 space-y-4
          ">
            <button
              onClick={() => setMeasureOpen(true)}
              className="
                w-full px-6 py-3 rounded-md 
                border border-amber-300 bg-white 
                hover:bg-amber-50 text-sm font-medium 
                transition shadow-sm
              "
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
              ✓ Measurements saved
            </p>
          )}

          {/* MATCHING SET */}
          {product.matchingSet && (
            <MatchingSet productId={product.id} />
          )}

          {/* BACK TO COLLECTION */}
          <a
            href={`/collection/${product.category}`}
            className="text-sm text-amber-700 hover:underline"
          >
            ← Back to {product.category.toUpperCase()} Collection
          </a>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* RELATED PRODUCTS */}
      {/* -------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <h3 className="text-2xl font-serif font-bold text-amber-900 mb-8">
          You May Also Like
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* MEASUREMENTS MODAL */}
      <MeasurementsModal
        open={measureOpen}
        onClose={() => setMeasureOpen(false)}
        product={product}
        onSave={(vals) => setSavedMeasurements(vals)}
      />
    </div>
  );
}

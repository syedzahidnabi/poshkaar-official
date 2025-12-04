"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

type SortOption = "recommended" | "priceLowHigh" | "priceHighLow" | "nameAZ";
type PriceFilter = "all" | "low" | "mid" | "high";

type Props = {
  title: string;
  subtitle: string;
  bannerImage: string;
  products: Product[];
  shimmer?: boolean;
  parallax?: boolean;
  goldenGlow?: boolean;
};

function parsePrice(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

export default function CollectionGridWithFilters({
  title,
  subtitle,
  bannerImage,
  products,
  shimmer = true,
  parallax = true,
  goldenGlow = true,
}: Props) {
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const processed = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        numericPrice: parsePrice(p.price),
      })),
    [products]
  );

  const filteredAndSorted = useMemo(() => {
    let list = [...processed];

    if (priceFilter !== "all") {
      list = list.filter((p) => {
        const price = p.numericPrice;
        if (priceFilter === "low") return price < 18000;
        if (priceFilter === "mid") return price >= 18000 && price <= 23000;
        if (priceFilter === "high") return price > 23000;
        return true;
      });
    }

    if (sortOption === "priceLowHigh")
      list.sort((a, b) => a.numericPrice - b.numericPrice);
    else if (sortOption === "priceHighLow")
      list.sort((a, b) => b.numericPrice - a.numericPrice);
    else if (sortOption === "nameAZ")
      list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [processed, priceFilter, sortOption]);

  return (
    <>
      {/* ===================== LUXURY BANNER ===================== */}
      <div
        className={`relative w-full h-72 md:h-96 flex flex-col justify-center items-center text-center overflow-hidden fade-smooth`}
        style={{
          backgroundImage: `url('${bannerImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gold shimmer overlay */}
        {shimmer && (
          <div className="absolute inset-0 pointer-events-none animate-shimmer opacity-60" />
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />

        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-xl">
            {title}
          </h1>
          <p className="mt-3 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="max-w-7xl mx-auto px-6 py-14 fade-smooth">
        {/* Header / filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold mb-1">{title} Pieces</h2>
            <p className="text-sm text-gray-600">
              Showing {filteredAndSorted.length} of {products.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="hidden md:inline-block border border-gray-300 rounded-full px-4 py-1.5 text-sm bg-white shadow-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="recommended">Recommended</option>
              <option value="priceLowHigh">Price: Low → High</option>
              <option value="priceHighLow">Price: High → Low</option>
              <option value="nameAZ">Name: A → Z</option>
            </select>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-5 py-2 rounded-full border border-yellow-700/60 bg-white text-yellow-800 font-medium text-sm hover:bg-yellow-50 transition shadow"
            >
              Filters & Sorting
            </button>
          </div>
        </div>

        {/* ===================== PRODUCT GRID ===================== */}
        {filteredAndSorted.length === 0 ? (
          <p className="text-gray-500">No products match the filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {filteredAndSorted.map((item) => (
              <div
                key={item.id}
                className={goldenGlow ? "glow-gold" : ""}
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <a
            href="/collection"
            className="text-yellow-700 hover:underline font-medium"
          >
            ← Back to all collections
          </a>
        </div>
      </div>

      {/* ===================== FILTER SIDEBAR ===================== */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[999] fade-smooth">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto rounded-l-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Refine {title}</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-xl text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Sorting */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold mb-2">Sort By</h4>
              <div className="space-y-2 text-sm">
                {[
                  ["recommended", "Recommended"],
                  ["priceLowHigh", "Price: Low → High"],
                  ["priceHighLow", "Price: High → Low"],
                  ["nameAZ", "Name: A → Z"],
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sort"
                      value={value}
                      checked={sortOption === value}
                      onChange={() =>
                        setSortOption(value as SortOption)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold mb-2">Price Range</h4>
              <div className="space-y-2 text-sm">
                {[
                  ["all", "All Prices"],
                  ["low", "Under ₹18,000"],
                  ["mid", "₹18,000 – ₹23,000"],
                  ["high", "Above ₹23,000"],
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priceFilter"
                      value={value}
                      checked={priceFilter === value}
                      onChange={() =>
                        setPriceFilter(value as PriceFilter)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-10">
              <button
                onClick={() => {
                  setSortOption("recommended");
                  setPriceFilter("all");
                }}
                className="flex-1 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-2 bg-yellow-700 text-white rounded-full text-sm font-semibold hover:bg-yellow-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

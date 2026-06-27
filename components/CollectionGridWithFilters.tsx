"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { formatCurrency, parsePrice } from "@/lib/price";

type SortOption = "recommended" | "priceLowHigh" | "priceHighLow" | "nameAZ";
type PriceFilter = "all" | "under5" | "fiveTo10" | "above10";

type Props = {
  title: string;
  subtitle: string;
  bannerImage: string;
  products: Product[];
  shimmer?: boolean;
  parallax?: boolean;
  goldenGlow?: boolean;
};

const priceOptions: Array<{
  value: PriceFilter;
  label: string;
  predicate: (price: number) => boolean;
}> = [
  { value: "all", label: "All prices", predicate: () => true },
  { value: "under5", label: "Under Rs 5,000", predicate: (price) => price < 5000 },
  {
    value: "fiveTo10",
    label: "Rs 5,000 to Rs 10,000",
    predicate: (price) => price >= 5000 && price <= 10000,
  },
  { value: "above10", label: "Above Rs 10,000", predicate: (price) => price > 10000 },
];

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "priceLowHigh", label: "Price: low to high" },
  { value: "priceHighLow", label: "Price: high to low" },
  { value: "nameAZ", label: "Name: A to Z" },
];

export default function CollectionGridWithFilters({
  title,
  subtitle,
  bannerImage,
  products,
}: Props) {
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const processed = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        numericPrice: parsePrice(product.price),
      })),
    [products]
  );

  const minPrice = processed.length
    ? Math.min(...processed.map((product) => product.numericPrice))
    : 0;
  const maxPrice = processed.length
    ? Math.max(...processed.map((product) => product.numericPrice))
    : 0;

  const filteredAndSorted = useMemo(() => {
    const selectedPrice = priceOptions.find(
      (option) => option.value === priceFilter
    );
    let list = processed.filter((product) =>
      selectedPrice ? selectedPrice.predicate(product.numericPrice) : true
    );

    if (sortOption === "priceLowHigh") {
      list = list.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (sortOption === "priceHighLow") {
      list = list.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (sortOption === "nameAZ") {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [processed, priceFilter, sortOption]);

  return (
    <main className="bg-[#f7f4ef] text-[#171412]">
      <section
        className="relative flex min-h-[44svh] items-center overflow-hidden px-6 py-16 text-white"
        style={{
          backgroundImage: `url('${bannerImage}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/46 to-black/12" />
        <div className="relative mx-auto w-full max-w-7xl">
          <Link
            href="/collection"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Collections
          </Link>
          <h1 className="max-w-3xl font-serif text-4xl font-bold md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-5 border-b border-black/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#8a1538]">
              {filteredAndSorted.length} of {products.length} pieces
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">
              Shop {title}
            </h2>
            {processed.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Prices from {formatCurrency(minPrice)} to {formatCurrency(maxPrice)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              className="h-11 rounded-md border border-black/15 bg-white px-3 text-sm font-medium outline-none focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#171412] px-4 text-sm font-bold text-white transition hover:bg-[#8a1538]"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
          </div>
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="rounded-lg border border-black/10 bg-white p-8 text-center">
            <h3 className="font-serif text-2xl font-bold">No pieces found</h3>
            <p className="mt-2 text-gray-600">
              Try clearing the price filter to see the full collection.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[999]">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label="Close filters"
            onClick={() => setIsFilterOpen(false)}
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 p-5">
              <h3 className="font-serif text-2xl font-bold">Refine</h3>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10"
                aria-label="Close filters"
                title="Close filters"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-5">
              <fieldset>
                <legend className="text-sm font-bold text-[#171412]">
                  Sort by
                </legend>
                <div className="mt-3 space-y-2">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-black/10 p-3 text-sm"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortOption === option.value}
                        onChange={() => setSortOption(option.value)}
                        className="accent-[#8a1538]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-bold text-[#171412]">
                  Price
                </legend>
                <div className="mt-3 space-y-2">
                  {priceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-black/10 p-3 text-sm"
                    >
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={priceFilter === option.value}
                        onChange={() => setPriceFilter(option.value)}
                        className="accent-[#8a1538]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-black/10 p-5">
              <button
                type="button"
                onClick={() => {
                  setSortOption("recommended");
                  setPriceFilter("all");
                }}
                className="h-11 rounded-md border border-black/15 text-sm font-bold"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="h-11 rounded-md bg-[#171412] text-sm font-bold text-white transition hover:bg-[#8a1538]"
              >
                Apply
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

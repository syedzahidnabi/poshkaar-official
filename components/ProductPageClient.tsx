"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  MessageCircle,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { products, type Product } from "@/data/products";
import { formatCurrency, parsePrice } from "@/lib/price";
import ProductGallery from "./ProductGallery";
import ColorSelector from "./ColorSelector";
import MeasurementsModal from "./MeasurementsModal";
import WhatsAppOrder from "./WhatsAppOrder";
import ProductCard from "./ProductCard";
import MatchingSet from "./MatchingSet";
import { useCart } from "./CartProvider";

type RatingData = {
  rating: number;
  count: number;
  sampleReviews: {
    author: string;
    rating: number;
    text: string;
    date: string;
  }[];
};

<<<<<<< HEAD
type Props = {
  productId: string;
  ratingData: RatingData;
};

export default function ProductPageClient({ productId, ratingData }: Props) {
  const product: Product | null = useMemo(
    () => products.find((p) => p.id === productId) || null,
=======
function stockClasses(status: Product["stockStatus"]) {
  if (status === "sold-out") return "bg-gray-950 text-white";
  if (status === "low-stock") return "bg-[#8a1538] text-white";
  return "bg-[#0f6f68] text-white";
}

function stockText(status: Product["stockStatus"]) {
  if (status === "sold-out") return "Sold out";
  if (status === "low-stock") return "Low stock";
  return "Ready to order";
}

export default function ProductPageClient({ productId }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const product = useMemo(
    () => products.find((item) => item.id === productId) || null,
>>>>>>> 4c42ba2 (Describe your changes)
    [productId]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  );
  const [measureOpen, setMeasureOpen] = useState(false);
  const [savedMeasurements, setSavedMeasurements] =
    useState<Record<string, string> | null>(null);
  const [cartMessage, setCartMessage] = useState("");

  const related = useMemo(
    () =>
      product
        ? products
            .filter(
              (item) =>
                item.category === product.category && item.id !== product.id
            )
            .slice(0, 3)
        : [],
    [product]
  );

<<<<<<< HEAD
  // Helper to show golden stars
  const renderStars = (val: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xl ${
              i <= val ? "text-amber-600" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

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

          {/* PRODUCT TITLE + PRICE + ⭐ RATING */}
          <div className="space-y-4">

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 leading-tight">
              {product.name}
            </h2>

            {/* ⭐ RATING DISPLAY */}
            <div className="flex items-center gap-3">
              {renderStars(Math.round(ratingData.rating))}
              <p className="text-sm text-gray-700">
                {ratingData.rating.toFixed(1)} ({ratingData.count} reviews)
              </p>
            </div>

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
=======
  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Product not found</h1>
        <p className="mt-3 text-gray-600">{productId}</p>
        <Link
          href="/collection"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-[#171412] px-4 text-sm font-bold text-white"
        >
          Browse collections
        </Link>
      </main>
    );
  }

  const price = formatCurrency(parsePrice(product.price));
  const isSoldOut = product.stockStatus === "sold-out";
  const canCustomize = product.customMeasurements !== false;
  const detailItems = [
    product.fabric ? ["Fabric", product.fabric] : null,
    product.workType ? ["Embroidery", product.workType] : null,
    product.specifications?.embroideryHours
      ? ["Work time", product.specifications.embroideryHours]
      : null,
    product.specifications?.care ? ["Care", product.specifications.care] : null,
  ].filter(Boolean) as Array<[string, string]>;

  const handleAddToCart = (goToCheckout = false) => {
    if (isSoldOut) return;

    addItem(product, {
      color: selectedColor,
      measurements: savedMeasurements,
    });

    setCartMessage("Added to cart");
    window.setTimeout(() => setCartMessage(""), 1800);

    if (goToCheckout) {
      router.push("/checkout");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171412]">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href={`/collection/${product.category}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8a1538] hover:text-[#171412]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to {product.category.toUpperCase()}
        </Link>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <ProductGallery product={product} selectedColor={selectedColor} />
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="border-b border-black/10 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-md px-3 py-1 text-xs font-bold ${stockClasses(
                  product.stockStatus
                )}`}
              >
                {stockText(product.stockStatus)}
              </span>
              {canCustomize && (
                <span className="rounded-md border border-black/10 bg-white px-3 py-1 text-xs font-bold text-gray-700">
                  Custom sizing
                </span>
              )}
            </div>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 font-serif text-3xl font-bold text-[#8a1538]">
              {price}
            </p>
            <p className="mt-5 text-lg leading-8 text-gray-700">
>>>>>>> 4c42ba2 (Describe your changes)
              {product.description}
            </p>
          </div>

<<<<<<< HEAD
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

          {/* ACTION BUTTONS */}
          <div
            className="
            sticky top-6 z-40 
            bg-white/90 backdrop-blur-xl 
            p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            border border-amber-100 space-y-4"
          >
            <button
              onClick={() => setMeasureOpen(true)}
              className="
                w-full px-6 py-3 rounded-md 
                border border-amber-300 bg-white 
                hover:bg-amber-50 text-sm font-medium 
                transition shadow-sm"
            >
              Add Custom Measurements
            </button>
=======
          {product.colors && product.colors.length > 0 && (
            <div className="border-b border-black/10 py-6">
              <h2 className="text-sm font-bold uppercase text-[#171412]">
                Color
              </h2>
              <div className="mt-3">
                <ColorSelector
                  colors={product.colors}
                  selected={selectedColor}
                  onSelect={setSelectedColor}
                />
              </div>
            </div>
          )}

          {detailItems.length > 0 && (
            <div className="grid grid-cols-2 gap-3 border-b border-black/10 py-6">
              {detailItems.map(([label, value]) => (
                <div key={label} className="rounded-md bg-white p-4 ring-1 ring-black/10">
                  <p className="text-xs font-bold uppercase text-gray-500">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#171412]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 py-6">
            {canCustomize && (
              <button
                type="button"
                onClick={() => setMeasureOpen(true)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-4 text-sm font-bold text-[#171412] transition hover:border-[#8a1538] hover:text-[#8a1538]"
              >
                <Ruler className="h-4 w-4" aria-hidden="true" />
                Add Measurements
              </button>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isSoldOut}
                onClick={() => handleAddToCart(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#171412] px-4 text-sm font-bold text-white transition hover:bg-[#8a1538] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {isSoldOut ? "Sold Out" : "Add to Cart"}
              </button>

              <button
                type="button"
                disabled={isSoldOut}
                onClick={() => handleAddToCart(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#8a1538] px-4 text-sm font-bold text-white transition hover:bg-[#6f102d] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Buy Now
              </button>
            </div>
>>>>>>> 4c42ba2 (Describe your changes)

            <WhatsAppOrder
              productName={product.name}
              color={selectedColor}
              measurements={savedMeasurements}
              className="block w-full"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Ask on WhatsApp
              </span>
            </WhatsAppOrder>

            {cartMessage && (
              <p className="rounded-md bg-green-50 p-3 text-sm font-semibold text-green-700">
                {cartMessage}
              </p>
            )}
            {savedMeasurements && (
              <p className="rounded-md bg-white p-3 text-sm font-semibold text-[#0f6f68] ring-1 ring-black/10">
                Measurements saved for this item.
              </p>
            )}
          </div>

<<<<<<< HEAD
          {savedMeasurements && (
            <p className="text-sm text-green-700">✓ Measurements saved</p>
          )}

          {/* MATCHING SET */}
          {product.matchingSet && <MatchingSet productId={product.id} />}

          {/* BACK LINK */}
          <a
            href={`/collection/${product.category}`}
            className="text-sm text-amber-700 hover:underline"
          >
            ← Back to {product.category.toUpperCase()} Collection
          </a>
=======
          <div className="grid gap-3 border-t border-black/10 pt-6 sm:grid-cols-2">
            <div className="flex gap-3 rounded-md bg-white p-4 ring-1 ring-black/10">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6f68]"
                aria-hidden="true"
              />
              <p className="text-sm leading-6 text-gray-700">
                Secure payment with Razorpay and UPI options.
              </p>
            </div>
            <div className="flex gap-3 rounded-md bg-white p-4 ring-1 ring-black/10">
              <Truck
                className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6f68]"
                aria-hidden="true"
              />
              <p className="text-sm leading-6 text-gray-700">
                Timelines confirmed before dispatch for custom work.
              </p>
            </div>
          </div>

          {product.matchingSet && (
            <div className="mt-6">
              <MatchingSet productId={product.id} />
            </div>
          )}
>>>>>>> 4c42ba2 (Describe your changes)
        </div>
      </section>

<<<<<<< HEAD
      {/* -------------------------------------------------- */}
      {/* ⭐ CUSTOMER REVIEWS SECTION */}
      {/* -------------------------------------------------- */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h3 className="text-2xl font-serif font-bold text-amber-900 mb-6">
          Customer Reviews
        </h3>

        <div className="space-y-6">
          {ratingData.sampleReviews.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow border border-amber-100"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{r.author}</p>
                {renderStars(r.rating)}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {r.text}
              </p>

              <p className="text-xs text-gray-500 mt-2">{r.date}</p>
            </div>
          ))}
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
=======
      {related.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-serif text-3xl font-bold">You may also like</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

>>>>>>> 4c42ba2 (Describe your changes)
      <MeasurementsModal
        open={measureOpen}
        onClose={() => setMeasureOpen(false)}
        product={product}
<<<<<<< HEAD
        onSave={(vals) => setSavedMeasurements(vals)}
=======
        onSave={(measurements) => setSavedMeasurements(measurements)}
>>>>>>> 4c42ba2 (Describe your changes)
      />
    </main>
  );
}

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

type Props = { productId: string };

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

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">Product not found</h1>
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
        <ProductGallery product={product} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="border-b border-black/10 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-md px-3 py-1 text-xs font-bold ${stockClasses(product.stockStatus)}`}>
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
              {product.description}
            </p>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="border-b border-black/10 py-6">
              <h2 className="text-sm font-bold uppercase text-[#171412]">Color</h2>
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
                  <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#171412]">{value}</p>
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
          </div>

          <div className="grid gap-3 border-t border-black/10 pt-6 sm:grid-cols-2">
            <div className="flex gap-3 rounded-md bg-white p-4 ring-1 ring-black/10">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6f68]" aria-hidden="true" />
              <p className="text-sm leading-6 text-gray-700">Secure payment with Razorpay and UPI options.</p>
            </div>
            <div className="flex gap-3 rounded-md bg-white p-4 ring-1 ring-black/10">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6f68]" aria-hidden="true" />
              <p className="text-sm leading-6 text-gray-700">Timelines confirmed before dispatch for custom work.</p>
            </div>
          </div>

          {product.matchingSet && (
            <div className="mt-6">
              <MatchingSet productId={product.id} />
            </div>
          )}
        </div>
      </section>

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

      <MeasurementsModal
        open={measureOpen}
        onClose={() => setMeasureOpen(false)}
        product={product}
        onSave={(measurements) => setSavedMeasurements(measurements)}
      />
    </main>
  );
}

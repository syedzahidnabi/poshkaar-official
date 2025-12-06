import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aari Collection – Intricate Kashmiri Needlework | Poshkaar",
  description:
    "Discover Poshkaar’s handcrafted Aari embroidery pieces—intricate motifs inspired by Kashmiri landscapes, Chinar leaves and floral vines.",
  alternates: { canonical: "https://www.poshkaar.com/collection/aari" },
  openGraph: {
    title: "Aari Collection – Handcrafted Kashmiri Aari Work",
    description:
      "Explore shawls, pherans, kurtas and couture pieces featuring expressive, intricate Aari needlework.",
    url: "https://www.poshkaar.com/collection/aari",
    images: [
      { url: "/images/collections/aari-banner.jpg", width: 1200, height: 630 },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Aari Collection",
};

export default function AariPage() {
  const aariProducts = products.filter((p) => p.category === "aari");

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CollectionGridWithFilters
        title="Aari Collection"
        subtitle="Intricate needlework inspired by Chinar leaves, roses & Kashmiri landscapes."
        bannerImage="/images/collections/aari-banner.jpg"
        products={aariProducts}
      />

      <section className="max-w-4xl mx-auto px-6 py-12 text-gray-700 space-y-4">
        <h2 className="text-2xl font-semibold text-amber-900">Aari Embroidery</h2>
        <p>
          Aari embroidery is one of the most loved crafts of Kashmir. It is done using a small hooked needle called an “Aari,” which helps artisans create fine and detailed designs with speed and accuracy. The motifs often include roses, vines, Chinar leaves, and patterns inspired by Kashmir’s nature and culture.
        </p>
        <p>
          At Poshkaar, we bring this beautiful craft to modern fashion through elegant silhouettes and high-quality fabrics. Our Aari Collection includes kurtas, wraps, pherans, and handcrafted pieces suitable for daily wear as well as special occasions.These garments are perfect for people who appreciate soft, graceful embroidery and refined craftsmanship. Every piece carries a part of Kashmir’s heritage and the dedication of the artisans who create them.
        </p>
      </section>
    </main>
  );
}

import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dabka Collection – 3D Metallic Kashmiri Couture | Poshkaar",
  description:
    "Explore handcrafted Dabka couture featuring dimensional metallic coils, sculpted embroidery and royal Mughal craftsmanship.",
  alternates: { canonical: "https://www.poshkaar.com/collection/dabka" },
  openGraph: {
    title: "Dabka Collection – Luxury Kashmiri Couture",
    description:
      "Discover bridal wear, festive outfits and couture statement pieces featuring intricate Kashmiri Dabka embroidery.",
    url: "https://www.poshkaar.com/collection/dabka",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Dabka Collection",
};

export default function DabkaPage() {
  const dabkaProducts = products.filter((p) => p.category === "dabka");

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CollectionGridWithFilters
        title="Dabka Collection"
        subtitle="Sculpted metallic coils & royal Mughal-era embroidery—crafted with precision."
        bannerImage="/images/collections/dabka-banner.jpg"
        products={dabkaProducts}
      />

      <section className="max-w-4xl mx-auto px-6 py-12 text-gray-700 space-y-4">
        <h2 className="text-2xl font-semibold text-amber-900">Dabka Embroidery</h2>
        <p>
          Dabka embroidery is known for its three-dimensional look and rich texture. It is made by hand using tightly coiled metallic wires, which are stitched onto the fabric to create raised, detailed patterns. This art form comes from Mughal traditions and requires great skill and patience
        </p>
        <p>
          At Poshkaar, we design Dabka outfits that combine traditional designs with modern fashion. Some pieces have delicate highlights, while others offer full, bold embroidery that makes a strong statement. These garments are often chosen for weddings, festive events, and occasions where you want to wear something memorable.Each Dabka piece is crafted with care to ensure beauty, durability, and a luxurious finish that reflects the finest Kashmiri artistry.
        </p>
      </section>
    </main>
  );
}

import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";
import type { Metadata } from "next";

// -------------------------------------------------------------
// ⭐ SEO METADATA (PHASE 1 – CATEGORY SEO OPTIMIZED)
// -------------------------------------------------------------
export const metadata: Metadata = {
  title: "Tilla Collection – Handcrafted Kashmiri Gold Threadwork | Poshkaar",
  description:
    "Explore Poshkaar’s luxury Tilla Collection featuring handcrafted gold and silver metallic thread embroidery from Kashmir. Shop pherans, kurtas, wedding couture and heirloom Tilla pieces crafted by master artisans.",
  alternates: {
    canonical: "https://www.poshkaar.com/collection/tilla",
  },
  openGraph: {
    title: "Tilla Collection – Luxury Kashmiri Embroidery",
    description:
      "Handcrafted Tilla embroidery using gold & silver metallic threads. Explore pherans, kurtas, occasion wear and heirloom Kashmiri couture at Poshkaar.",
    url: "https://www.poshkaar.com/collection/tilla",
    type: "website",
    images: [
      {
        url: "/images/collections/tilla-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Tilla Collection – Poshkaar Kashmir",
      },
    ],
  },
  robots: { index: true, follow: true },
};

// -------------------------------------------------------------
// ⭐ JSON-LD STRUCTURED DATA FOR CATEGORY
// -------------------------------------------------------------
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Tilla Collection",
  description:
    "Handcrafted Kashmiri Tilla embroidery featuring gold and silver metallic threadwork by master artisans.",
  url: "https://www.poshkaar.com/collection/tilla",
  image: "https://www.poshkaar.com/images/collections/tilla-banner.jpg",
};

export default function TillaPage() {
  const tillaProducts = products.filter((p) => p.category === "tilla");

  return (
    <main className="fade-smooth">
      {/* Inject SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CollectionGridWithFilters
        title="Tilla Collection"
        subtitle="Handcrafted gold & silver metallic threadwork — Kashmiri heritage reimagined for modern luxury."
        bannerImage="/images/collections/tilla-banner.jpg"
        products={tillaProducts}
      />

      {/* ------------------------------------------------------------- */}
      {/* ⭐ LONG-FORM SEO TEXT (add below the grid for ranking boost) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-gray-700 leading-relaxed text-[15px] space-y-4">
        <h2 className="text-2xl font-semibold text-amber-900">
          The Art of Kashmiri Tilla Work
        </h2>

        <p>
          Tilla embroidery is one of the most special crafts of Kashmir. It is made by hand using gold and silver threads, carefully stitched onto soft fabrics. Each design takes many hours of patient work, and every artisan learns this skill from generations before them. At Poshkaar, we honour this tradition by creating Tilla pieces that feel elegant, rich, and timeless.
        </p>

        <p>
         Our Tilla Collection includes handcrafted pherans, kurtas, shawls, and wedding outfits. We use premium fabrics such as silk, velvet, chiffon, and fine wool to ensure a beautiful drape and long-lasting quality. Whether you want something for a wedding, festival, or a special family event, our Tilla pieces bring a royal and classic touch to your wardrobe.
        </p>

        <p>
          Explore the Tilla Collection and find pieces that are designed to be cherished and passed down as heirlooms.
        </p>
      </section>
    </main>
  );
}

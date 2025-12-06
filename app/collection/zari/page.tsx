import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zari Collection – Kashmiri Metallic Thread Couture | Poshkaar",
  description:
    "Explore Poshkaar’s Zari Collection: handcrafted metallic thread embroidery rooted in royal Kashmiri tradition. Shop shawls, pherans, kurtas & occasion wear.",
  alternates: { canonical: "https://www.poshkaar.com/collection/zari" },
  openGraph: {
    title: "Zari Collection – Luxury Kashmiri Embroidery",
    description:
      "Hand-embroidered Zari couture featuring luminous metallic threadwork on silk, velvet & organza.",
    url: "https://www.poshkaar.com/collection/zari",
    images: [
      {
        url: "/images/collections/zari-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Zari Collection",
      },
    ],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Zari Collection",
  url: "https://www.poshkaar.com/collection/zari",
};

export default function ZariPage() {
  const zariProducts = products.filter((p) => p.category === "zari");

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CollectionGridWithFilters
        title="Zari Collection"
        subtitle="Hand-embroidered metallic threadwork inspired by Kashmiri royal ateliers."
        bannerImage="/images/collections/zari-banner.jpg"
        products={zariProducts}
      />

      <section className="max-w-4xl mx-auto px-6 py-12 text-gray-700 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-semibold text-amber-900">Zari Embroidery</h2>
        <p>
          Zari embroidery is known for its shine, detail, and royal look. It began in the workshops of kings and has remained an important part of Indian and Kashmiri fashion. Zari uses fine metallic threads to create glowing patterns and designs that catch the light beautifully. At Poshkaar, we blend this traditional craft with modern styles to make outfits that feel both classic and comfortable.
        </p>
        <p>
          Our Zari Collection includes hand-embroidered pieces made on silk, georgette, velvet, linen, and organza. Some designs are soft and subtle, while others have bold golden details for special occasions. Each garment is crafted carefully to ensure quality, elegance, and long-lasting beauty.These pieces are perfect for weddings, celebrations, cultural events, or festive gatherings—and can make any moment feel more special. 
       </p>
      </section>
    </main>
  );
}

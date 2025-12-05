// app/collection/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kashmiri Embroidery Collections – Tilla, Zari, Aari & Dabka | Poshkaar",
  description:
    "Explore Poshkaar’s handcrafted Kashmiri embroidery collections – Tilla, Zari, Aari, and Dabka. Each piece is artisan-made with heritage techniques.",
  openGraph: {
    title: "Kashmiri Embroidery Collections | Poshkaar",
    description:
      "Handcrafted Kashmiri Tilla, Zari, Aari & Dabka embroidery collections. Explore premium traditional fashion curated from master artisans.",
    url: "https://poshkaar.in/collection",
    siteName: "Poshkaar Kashmir",
    images: [
      {
        url: "/images/collections/collection-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Poshkaar Kashmiri Embroidery Collections",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://poshkaar.in/collection",
  },
};

// Structured Data (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Poshkaar Kashmiri Embroidery Collections",
  description:
    "Shop handcrafted Kashmiri embroidery: Tilla, Zari, Aari, and Dabka collections made by master artisans.",
  url: "https://poshkaar.in/collection",
  image: "https://poshkaar.in/images/collections/collection-banner.jpg",
  hasPart: [
    {
      "@type": "Collection",
      name: "Tilla Collection",
      url: "https://poshkaar.in/collection/tilla",
    },
    {
      "@type": "Collection",
      name: "Zari Collection",
      url: "https://poshkaar.in/collection/zari",
    },
    {
      "@type": "Collection",
      name: "Aari Collection",
      url: "https://poshkaar.in/collection/aari",
    },
    {
      "@type": "Collection",
      name: "Dabka Collection",
      url: "https://poshkaar.in/collection/dabka",
    },
  ],
};

const collections = [
  {
    title: "Tilla Collection",
    slug: "tilla",
    image: "/images/collections/tilla-banner.jpg",
    description: "Handcrafted gold threadwork rooted in Kashmiri heritage.",
  },
  {
    title: "Zari Collection",
    slug: "zari",
    image: "/images/collections/zari-banner.jpg",
    description: "Timeless metallic thread embroidery with regal detailing.",
  },
  {
    title: "Aari Collection",
    slug: "aari",
    image: "/images/collections/aari-banner.jpg",
    description: "Exquisite hand needlework crafted by master artisans.",
  },
  {
    title: "Dabka Collection",
    slug: "dabka",
    image: "/images/collections/dabka-banner.jpg",
    description: "Rich coiled embroidery with royal texture and shine.",
  },
];

export default function CollectionIndexPage() {
  return (
    <main className="bg-cream min-h-screen fade-smooth">

      {/* ---------------- JSON-LD SEO ---------------- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------- HERO ---------------- */}
      <section
        className="
          relative w-full h-64 md:h-80 flex flex-col items-center justify-center 
          text-white text-center
        "
        style={{
          backgroundImage: "url('/images/collections/collection-banner.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

        <h1 className="text-4xl md:text-5xl font-bold z-10 drop-shadow-xl">
          Our Collections
        </h1>
        <p className="text-lg md:text-xl mt-3 z-10 text-yellow-100 drop-shadow">
          Explore the timeless artistry of handcrafted Kashmiri embroidery
        </p>
      </section>

      {/* ---------------- COLLECTION GRID ---------------- */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">

          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collection/${col.slug}`}
              className="
                group block bg-white rounded-3xl overflow-hidden shadow-xl 
                border border-yellow-700/30 transition-all duration-700
                hover:-translate-y-2 hover:shadow-yellow-900/40 hover:shadow-2xl
              "
            >

              {/* Glow overlay */}
              <div className="
                absolute inset-0 rounded-3xl pointer-events-none
                bg-gradient-to-br from-yellow-400/10 to-yellow-700/20
                opacity-0 group-hover:opacity-100 transition duration-700
              " />

              {/* Image */}
              <div className="h-60 overflow-hidden relative rounded-t-3xl">
                <img
                  src={col.image}
                  alt={col.title}
                  className="
                    w-full h-full object-cover 
                    transition duration-700 group-hover:scale-110
                  "
                />

                <span className="
                  absolute top-4 left-4 px-4 py-1 text-xs tracking-wider 
                  bg-black/60 text-white rounded-full backdrop-blur-sm shadow-md
                ">
                  Handcrafted
                </span>
              </div>

              {/* Text */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                  {col.title}
                </h2>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {col.description}
                </p>

                <p className="
                  text-yellow-800 font-semibold tracking-wide
                  group-hover:underline group-hover:text-yellow-900 transition
                ">
                  View Collection →
                </p>
              </div>

            </Link>
          ))}

        </div>
      </section>
    </main>
  );
}

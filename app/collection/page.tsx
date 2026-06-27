<<<<<<< HEAD
// app/collection/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

// ----------------------------------------------------------------------------
// PAGE-LEVEL METADATA (SEO)
// ----------------------------------------------------------------------------
export const metadata: Metadata = {
  title:
    "Kashmiri Embroidery Collections – Tilla, Zari, Aari & Dabka | Poshkaar",
  description:
    "Explore Poshkaar’s handcrafted Kashmiri embroidery collections – Tilla, Zari, Aari, and Dabka. Each masterpiece is crafted by Kashmiri artisans using heritage embroidery techniques.",
  openGraph: {
    title: "Kashmiri Embroidery Collections | Poshkaar",
    description:
      "Handcrafted Kashmiri Tilla, Zari, Aari & Dabka embroidery collections. Explore premium traditional fashion curated from master artisans.",
    url: "https://www.poshkaar.com/collection",
    siteName: "Poshkaar Kashmir",
    type: "website",
    images: [
      {
        url: "/images/collections/collection-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Poshkaar Kashmiri Embroidery Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashmiri Embroidery Collections | Poshkaar",
    description:
      "Handcrafted Kashmiri Tilla, Zari, Aari & Dabka couture made by master artisans.",
    images: ["/images/collections/collection-banner.jpg"],
  },
  alternates: {
    canonical: "https://www.poshkaar.com/collection",
  },
};

// ----------------------------------------------------------------------------
// JSON-LD STRUCTURED DATA FOR COLLECTIONS (GOOGLE SEO)
// ----------------------------------------------------------------------------
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Poshkaar Kashmiri Embroidery Collections",
  description:
    "Shop handcrafted Kashmiri embroidery: Tilla, Zari, Aari, and Dabka collections crafted by expert artisans.",
  url: "https://www.poshkaar.com/collection",
  image: "https://www.poshkaar.com/images/collections/collection-banner.jpg",

  hasPart: [
    {
      "@type": "Collection",
      name: "Tilla Collection",
      url: "https://www.poshkaar.com/collection/tilla",
    },
    {
      "@type": "Collection",
      name: "Zari Collection",
      url: "https://www.poshkaar.com/collection/zari",
    },
    {
      "@type": "Collection",
      name: "Aari Collection",
      url: "https://www.poshkaar.com/collection/aari",
    },
    {
      "@type": "Collection",
      name: "Dabka Collection",
      url: "https://www.poshkaar.com/collection/dabka",
    },
  ],
};

// ----------------------------------------------------------------------------
// COLLECTION GRID DATA
// ----------------------------------------------------------------------------
const collections = [
  {
    title: "Tilla Collection",
    slug: "tilla",
    image: "/images/collections/tilla-banner.jpg",
    description: "Handcrafted gold threadwork rooted in Kashmiri heritage.",
=======
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck } from "lucide-react";
import {
  craftCollections,
  getCollectionCount,
  siteUrl,
} from "@/data/commerce";

export const metadata: Metadata = {
  title: "Kashmiri Embroidery Collections | Poshkaar",
  description:
    "Shop Poshkaar's handcrafted Tilla, Zari, Aari and Dabka collections from Kashmir.",
  alternates: {
    canonical: `${siteUrl}/collection`,
>>>>>>> 4c42ba2 (Describe your changes)
  },
  openGraph: {
    title: "Kashmiri Embroidery Collections | Poshkaar",
    description:
      "Handcrafted Kashmiri Tilla, Zari, Aari and Dabka fashion made by skilled artisans.",
    url: `${siteUrl}/collection`,
    siteName: "Poshkaar Kashmir",
    images: [
      {
        url: "/images/collections/collection-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Poshkaar Kashmiri embroidery collections",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
<<<<<<< HEAD
  {
    title: "Aari Collection",
    slug: "aari",
    image: "/images/collections/aari-banner.jpg",
    description: "Exquisite hand needlework crafted by Kashmiri master artisans.",
  },
  {
    title: "Dabka Collection",
    slug: "dabka",
    image: "/images/collections/dabka-banner.jpg",
    description: "Rich coiled embroidery with royal depth, texture and shine.",
  },
];
=======
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Poshkaar Kashmiri Embroidery Collections",
  description:
    "Shop handcrafted Kashmiri embroidery: Tilla, Zari, Aari and Dabka collections made by artisans.",
  url: `${siteUrl}/collection`,
  image: `${siteUrl}/images/collections/collection-banner.jpg`,
};
>>>>>>> 4c42ba2 (Describe your changes)

// ----------------------------------------------------------------------------
// PAGE COMPONENT
// ----------------------------------------------------------------------------
export default function CollectionIndexPage() {
  return (
    <main className="bg-[#f7f4ef] text-[#171412]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------------------------- */}
      <section
<<<<<<< HEAD
        className="
          relative w-full h-64 md:h-80 flex flex-col items-center justify-center
          text-white text-center
        "
=======
        className="relative flex min-h-[46svh] items-center overflow-hidden px-6 py-16 text-white"
>>>>>>> 4c42ba2 (Describe your changes)
        style={{
          backgroundImage: "url('/images/collections/collection-banner.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
<<<<<<< HEAD
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

        {/* Soft gold shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />

        <h1 className="text-4xl md:text-5xl font-bold z-10 drop-shadow-xl">
          Our Collections
        </h1>
        <p className="text-lg md:text-xl mt-3 z-10 text-yellow-100 drop-shadow">
          Explore the timeless artistry of handcrafted Kashmiri embroidery
        </p>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* COLLECTION GRID */}
      {/* ---------------------------------------------------------------------- */}
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
              {/* Gold glow on hover */}
              <div
                className="
                  absolute inset-0 rounded-3xl pointer-events-none
                  bg-gradient-to-br from-yellow-400/10 to-yellow-700/20
                  opacity-0 group-hover:opacity-100 transition duration-700
                "
              />

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

                <span
                  className="
                    absolute top-4 left-4 px-4 py-1 text-xs tracking-wider
                    bg-black/60 text-white rounded-full backdrop-blur-sm shadow-md
                  "
                >
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

                <p
                  className="
                    text-yellow-800 font-semibold tracking-wide
                    group-hover:underline group-hover:text-yellow-900 transition
                  "
                >
                  View Collection →
                </p>
              </div>
            </Link>
          ))}

        </div>
      </section>
=======
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/44 to-black/12" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-semibold uppercase text-[#d8b862]">
            Craft directory
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold md:text-6xl">
            Choose the embroidery that carries your occasion
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
            Each collection is built around a distinct Kashmiri craft language,
            with pieces for daily elegance, gifting, winter wardrobes and
            wedding ensembles.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {craftCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collection/${collection.slug}`}
              className="group grid overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10 transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative min-h-[280px] overflow-hidden bg-[#221d1a]">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/58 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-1 text-sm font-bold text-[#171412]">
                  {getCollectionCount(collection.slug)} pieces
                </span>
              </div>

              <div className="flex min-h-[280px] flex-col justify-between p-6">
                <div>
                  <p className="text-sm font-semibold uppercase text-[#8a1538]">
                    {collection.mood}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-bold">
                    {collection.title}
                  </h2>
                  <p className="mt-4 leading-7 text-gray-600">
                    {collection.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <BadgeCheck
                      className="h-4 w-4 text-[#0f6f68]"
                      aria-hidden="true"
                    />
                    Handcrafted in Kashmir
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#8a1538]">
                    Shop
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
>>>>>>> 4c42ba2 (Describe your changes)
    </main>
  );
}

<<<<<<< HEAD
import type { Metadata } from "next";
import HomePage from "./HomePage";

// ------------------------------------------------------
// ⭐ HOMEPAGE METADATA (SEO)
// ------------------------------------------------------
export const metadata: Metadata = {
  title: "Poshkaar – Luxury Kashmiri Tilla, Zari, Aari & Dabka Couture",
  description:
    "Handcrafted Kashmiri couture featuring Tilla, Zari, Aari and Dabka embroidery. Heritage-rich, artisan-made fashion inspired by generations of craftsmanship.",
  keywords: [
    "Kashmiri Tilla work",
    "Zari embroidery",
    "Aari embroidery",
    "Dabka work",
    "Kashmiri pheran",
    "handcrafted Kashmir fashion",
    "Kashmiri couture",
    "Poshkaar Kashmir",
  ],
  alternates: { canonical: "https://www.poshkaar.com" },
=======
import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  atelierHighlights,
  craftCollections,
  featuredProductIds,
  getCollectionCount,
  getProductsByIds,
  whatsappNumber,
} from "@/data/commerce";

const featuredProducts = getProductsByIds(featuredProductIds);
>>>>>>> 4c42ba2 (Describe your changes)

  openGraph: {
    title: "Poshkaar – Luxury Kashmiri Handcrafted Couture",
    description:
      "Explore artisan-made Tilla, Zari, Aari and Dabka couture from Kashmir. Heritage luxury woven by master craftsmen.",
    url: "https://www.poshkaar.com",
    siteName: "Poshkaar",
    type: "website",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Poshkaar Luxury Couture",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Poshkaar – Luxury Kashmiri Couture",
    description:
      "Handcrafted Kashmiri Tilla, Zari, Aari & Dabka couture for timeless elegance.",
    images: ["/og-banner.jpg"],
  },

  robots: { index: true, follow: true },
};

// ------------------------------------------------------
// ⭐ STRUCTURED DATA (JSON-LD)
// ------------------------------------------------------
const jsonLdHome = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Poshkaar",
  url: "https://www.poshkaar.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.poshkaar.com/search?q={search_term}",
    "query-input": "required name=search_term",
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Poshkaar Kashmir",
  url: "https://www.poshkaar.com",
  logo: "https://www.poshkaar.com/logo.png",
  sameAs: [
    "https://www.instagram.com/poshkaar",
    "https://www.facebook.com/poshkaar",
  ],
};

// ------------------------------------------------------
// ⭐ PAGE (SERVER COMPONENT)
// ------------------------------------------------------
export default function Page() {
  return (
<<<<<<< HEAD
    <>
      {/* JSON-LD injected on server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />

      <HomePage />
    </>
=======
    <main className="bg-[#f7f4ef] text-[#171412]">
      <section
        className="relative flex min-h-[74svh] items-center overflow-hidden bg-[#171412] px-6 py-16 text-white"
        style={{
          backgroundImage: "url('/images/main-banner.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/44 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f7f4ef] to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase text-[#d8b862]">
              The Threads of Paradise
            </p>
            <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-7xl">
              Poshkaar Kashmir
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/88 md:text-xl">
              Luxury Kashmiri embroidery for modern wardrobes: Tilla, Zari,
              Aari and Dabka pieces made with patience, precision and soul.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/collection"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d8b862] px-5 text-sm font-bold text-[#171412] transition hover:bg-[#e7ca76]"
              >
                Shop Collections
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/60 px-5 text-sm font-bold text-white transition hover:bg-white hover:text-[#171412]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Custom Order
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-white/82">
              <div>
                <span className="block font-serif text-3xl text-[#d8b862]">
                  4
                </span>
                craft families
              </div>
              <div>
                <span className="block font-serif text-3xl text-[#d8b862]">
                  37+
                </span>
                curated pieces
              </div>
              <div>
                <span className="block font-serif text-3xl text-[#d8b862]">
                  2-6w
                </span>
                custom timelines
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#8a1538]">
              Shop by craft
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Four embroidery languages, one Kashmiri signature
            </h2>
          </div>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8a1538] hover:text-[#171412]"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {craftCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collection/${collection.slug}`}
              className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#221d1a]">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/12 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-serif text-2xl font-bold">
                    {collection.shortTitle}
                  </h3>
                  <p className="mt-1 text-sm text-white/82">
                    {getCollectionCount(collection.slug)} pieces
                  </p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-gray-600">
                  {collection.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#8a1538]">
                  {collection.mood}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#0f6f68]">
                Current edit
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                Pieces with presence
              </h2>
              <p className="mt-3 max-w-2xl text-gray-600">
                A tighter selection for weddings, winter gatherings, Eid,
                gifting and made-to-measure wardrobes.
              </p>
            </div>
            <Link
              href="/collection"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#171412] px-4 text-sm font-bold transition hover:bg-[#171412] hover:text-white"
            >
              Browse all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[#171412]">
          <img
            src="/images/artists.jpg"
            alt="Kashmiri artisan embroidery at Poshkaar"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/58 to-transparent" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase text-[#8a1538]">
            Atelier promise
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
            Slow fashion, made close to the hand
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-700">
            Poshkaar is built around Kashmiri karigari: real embroidery,
            considered fabrics, small batches and practical support for custom
            sizing. The result is occasionwear that feels personal rather than
            disposable.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {atelierHighlights.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-md border border-black/10 bg-white p-4"
              >
                <BadgeCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6f68]"
                  aria-hidden="true"
                />
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden px-6 py-20 text-white"
        style={{
          backgroundImage: "url('/images/hero-main.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#171412]/76" />
        <div className="relative mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-4 inline-flex h-10 items-center gap-2 rounded-md border border-white/20 px-3 text-sm text-white/88">
              <Sparkles className="h-4 w-4 text-[#d8b862]" aria-hidden="true" />
              Bridal, festive and family ensembles
            </div>
            <h2 className="max-w-3xl font-serif text-3xl font-bold md:text-5xl">
              Building a wedding wardrobe or a one-of-one piece?
            </h2>
            <p className="mt-4 max-w-2xl text-white/78">
              Share your color story, measurements and date. Poshkaar can help
              shape matching sets, pherans, suits, shawls and statement pieces
              around your event.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hello Poshkaar, I would like help with a custom order."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d8b862] px-5 text-sm font-bold text-[#171412] transition hover:bg-[#e7ca76]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Start Consultation
          </a>
        </div>
      </section>
    </main>
>>>>>>> 4c42ba2 (Describe your changes)
  );
}

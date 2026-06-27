import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { craftCollections, getCollectionCount, siteUrl } from "@/data/commerce";

export const metadata: Metadata = {
  title: "Kashmiri Embroidery Collections | Poshkaar",
  description:
    "Shop Poshkaar's handcrafted Tilla, Zari, Aari and Dabka collections from Kashmir.",
  alternates: { canonical: `${siteUrl}/collection` },
};

export default function CollectionIndexPage() {
  return (
    <main className="bg-[#f7f4ef] text-[#171412]">
      <section
        className="relative flex min-h-[46svh] items-center overflow-hidden px-6 py-16 text-white"
        style={{
          backgroundImage: "url('/images/collections/collection-banner.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
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
                    <BadgeCheck className="h-4 w-4 text-[#0f6f68]" aria-hidden="true" />
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
    </main>
  );
}

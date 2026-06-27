import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

const values = [
  "Direct artisan-led work in Kashmir",
  "Small batches and made-to-order production",
  "Traditional techniques shaped for modern wardrobes",
  "Practical custom sizing and event-order support",
];

export default function AboutPage() {
  return (
    <main className="bg-[#f7f4ef] text-[#171412]">
      <section
        className="relative flex min-h-[48svh] items-center overflow-hidden px-6 py-16 text-white"
        style={{
          backgroundImage: "url('/images/gul.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/44 to-black/12" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-semibold uppercase text-[#d8b862]">
            Our story
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold md:text-6xl">
            Kashmiri craft, built for lasting wardrobes
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
            Poshkaar works with the language of Tilla, Zari, Aari and Dabka to
            create pieces that hold cultural memory without feeling stuck in the
            past.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-[#8a1538]">
            Philosophy
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
            Slow work is the point
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-700">
            Every piece begins with material, motif and use-case. Some customers
            need a winter pheran. Some need a wedding outfit. Some need a family
            set that feels coordinated without looking generic. Poshkaar keeps
            those details central.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-700">
            The result is a practical luxury: detailed embroidery, clear
            communication, and pieces made to be worn, preserved and re-worn.
          </p>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10">
          <Image
            src="/images/gess.jpg"
            alt="Artisan embroidery work"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-serif text-3xl font-bold">What Poshkaar stands for</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {values.map((value) => (
              <div key={value} className="rounded-lg bg-[#f7f4ef] p-5 ring-1 ring-black/10">
                <BadgeCheck className="h-5 w-5 text-[#0f6f68]" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold leading-6 text-gray-700">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative min-h-[380px] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10">
          <Image
            src="/images/shan.jpg"
            alt="Kashmiri craftsmanship"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-[#8a1538]">
            Craft process
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
            Detail before volume
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-700">
            Embroidery timelines vary by density and technique. Ready pieces can
            move quickly, while custom and heavily worked garments need more
            time. That timeline is part of the quality control, not an
            afterthought.
          </p>
          <Link
            href="/collection"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#171412] px-5 text-sm font-bold text-white transition hover:bg-[#8a1538]"
          >
            Explore collections
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

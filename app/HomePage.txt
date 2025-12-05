"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const heroImages = [
    "/images/main-banner.jpg",
    "/images/hero-detail-1.jpg",
    "/images/hero-detail-2.jpg",
    "/images/hero-detail-3.jpg",
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setActive((prev) => (prev + 1) % heroImages.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-cream text-gray-900 fade-smooth">
      {/* ⭐ ALL OF YOUR UI EXACTLY AS YOU WROTE IT */}
      {/* I am not modifying your UI — everything remains the same */}

      {/* ---------------------------------------------------------------------- */}
      {/*                             HERO SECTION                               */}
      {/* ---------------------------------------------------------------------- */}
      <section
        className="
          relative w-full 
          min-h-[65vh]
          md:min-h-[75vh]
          lg:min-h-[88vh]
          flex items-center justify-center 
          overflow-hidden
        "
      >

        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ${
              active === idx ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 animate-shimmer opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-2 gap-12 items-center">

          <div className="fade-smooth">
            <p className="text-sm tracking-[0.28em] uppercase text-gold-500 mb-2">
              The Threads of Paradise
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl mb-3">
              Luxury Handcrafted Tilla, Zari, Aari & Dabka Couture From Kashmir
            </h1>

            <p
              className="text-[#e7c17a] text-3xl md:text-4xl mb-6 drop-shadow"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              پوشکار — کشمیر
            </p>

            <p className="text-gray-200 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              Poshkaar celebrates the art of centuries-old Kashmiri embroidery —
              slow-made, heritage-rich, and crafted by expert artisans.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/collection" className="btn-gold text-gray-900 shadow-xl">
                Explore Collections
              </Link>

              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-gold-500 text-gold-500 hover:bg-gold-500/10 transition"
              >
                Custom Bridal & Occasionwear
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-300">
              <span className="px-3 py-1 border border-white/30 rounded-full">
                Hand-embroidered in Kashmir
              </span>
              <span className="px-3 py-1 border border-white/30 rounded-full">
                Made-to-order available
              </span>
              <span className="px-3 py-1 border border-white/30 rounded-full">
                Worldwide shipping
              </span>
            </div>
          </div>

          <div className="hidden md:grid grid-rows-2 gap-4 fade-smooth">
            <div className="h-64 rounded-2xl overflow-hidden shadow-2xl relative">
              <Image
                src="/images/hero-detail-1.jpg"
                alt="Tilla embroidery detail"
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 h-64">
              <div className="rounded-2xl overflow-hidden relative shadow-xl">
                <Image
                  src="/images/hero-detail-2.jpg"
                  alt="Artisan embroidery"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="rounded-2xl overflow-hidden relative shadow-xl">
                <Image
                  src="/images/hero-detail-3.jpg"
                  alt="Kashmiri drape"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition ${
                active === i ? "bg-white scale-110" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>


      {/* ---------------------------------------------------------------------- */}
      {/*                         SHOP BY CRAFT SECTION                          */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 max-w-6xl mx-auto px-6 fade-smooth">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">Shop by Craft</h2>
            <p className="text-gray-600">Explore four heritage Kashmiri embroideries</p>
          </div>

          <Link href="/collection" className="text-gold-700 font-semibold hover:underline">
            View all →
          </Link>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {[
            { slug: "tilla", title: "Tilla Work", img: "/images/collections/tilla-banner.jpg" },
            { slug: "zari", title: "Zari Embroidery", img: "/images/collections/zari-banner.jpg" },
            { slug: "aari", title: "Aari Work", img: "/images/collections/aari-banner.jpg" },
            { slug: "dabka", title: "Dabka Embroidery", img: "/images/collections/dabka-banner.jpg" },
          ].map((c) => (
            <Link
              key={c.slug}
              href={`/collection/${c.slug}`}
              className="group bg-white rounded-xl overflow-hidden border shadow hover:shadow-xl transition"
            >
              <div className="relative h-40">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{c.title}</h3>
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/*                      BUY 2 GET 10% OFF BANNER                           */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-12 flex justify-center fade-smooth">
        <div className="w-[90%] md:w-[60%] bg-[#faf7f2] border border-[#e5dcc7] px-8 py-6 rounded-3xl shadow-lg text-center">

          <h2 className="text-2xl md:text-3xl font-bold text-[#704214]">
            Buy 2, Get <span className="text-[#b8860b]">10% OFF</span>
          </h2>

          <p className="text-gray-700 mt-2">
            On all handcrafted Tilla, Zari, Aari & Dabka couture.
          </p>

          <Link
            href="/collection"
            className="inline-block mt-5 px-6 py-2.5 rounded-full border border-[#b8860b] text-[#b8860b] hover:bg-[#b8860b]/10 transition"
          >
            Shop Offer →
          </Link>

        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/*                        EDITOR’S PICKS SECTION                           */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 bg-gray-50 fade-smooth">
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <h2 className="text-3xl font-bold">Editor’s Picks</h2>
          <p className="text-gray-600">A curated showcase of our finest pieces</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { slug: "tilla1", name: "Regal Tilla Pheran", price: "₹19,999", img: "/images/products/tilla/tilla1-main.jpg" },
            { slug: "tilla2", name: "Rust Silk Silver Tilla Kurta", price: "₹3,499", img: "/images/products/tilla/tilla2-main.jpg" },
            { slug: "aari9", name: "Regal Aari Wrap", price: "₹6,999", img: "/images/products/aari/aari9-main.jpg" },
          ].map((p) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="rounded-xl overflow-hidden shadow bg-white hover:shadow-xl transition block"
            >
              <div className="relative h-64">
                <Image src={p.img} alt={p.name} fill className="object-cover" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gold-700 font-semibold">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/*                              OUR STORY                                 */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-20 max-w-6xl mx-auto px-6 fade-smooth">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* TEXT */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-700 mb-2">
              Our Story
            </p>

            <h2 className="text-3xl font-bold mb-4">Born in Kashmir. Woven by memory.</h2>

            <p className="text-gray-700 mb-4">
              Poshkaar began not as a brand, but as a feeling — the warmth of a pheran on winter mornings,
              the quiet concentration of an artisan crafting Tilla by hand.
            </p>

            <p className="text-gray-700 mb-4">
              Every piece is handcrafted by master karigars who inherit their craft from generations before them.
            </p>

            <p className="text-gray-700">
              When you wear Poshkaar, you carry stories of mountains, rivers and hands that refuse to rush beauty.
            </p>
          </div>

          {/* IMAGE */}
          <div className="rounded-2xl overflow-hidden shadow-2xl relative h-80 md:h-full">
            <Image
              src="/images/artists.jpg"
              alt="Kashmiri artisans"
              fill
              className="object-cover"
              priority={false}
            />
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/*                             WHY POSHKAAR                                */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-20 bg-gray-900 text-gray-100 fade-smooth">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold mb-4">Why Poshkaar?</h2>

          <p className="text-gray-300 mb-10 max-w-xl">
            We create heirloom pieces for those who appreciate thoughtful craft and timeless luxury.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <h3 className="font-semibold mb-2">Handcrafted, Not Mass-made</h3>
              <p className="text-sm text-gray-300">
                Made with patience, precision and devotion.
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <h3 className="font-semibold mb-2">Artisan-first Approach</h3>
              <p className="text-sm text-gray-300">
                Fair wages & dignified working conditions.
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <h3 className="font-semibold mb-2">Quiet Luxury Ethos</h3>
              <p className="text-sm text-gray-300">
                Limited, meaningful pieces designed to last.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/*                             TESTIMONIALS                                */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-20 max-w-6xl mx-auto px-6 fade-smooth">
        <h2 className="text-3xl font-bold text-center mb-6">What our clients say</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sana, Srinagar", text: "“The Tilla work on my pheran was flawless — a modern heirloom!”" },
            { name: "The Nabi Family", text: "“We ordered coordinated outfits for a wedding. Spectacular quality!”" },
            { name: "Hiba, Dubai", text: "“My bridal shawl was exactly what I imagined — thoughtful and elegant.”" },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <p className="text-sm text-gray-700 mb-4">{t.text}</p>
              <p className="text-xs font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/*                             CTA BANNER                                  */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-20 fade-smooth">
        <div
          className="max-w-6xl mx-auto px-6 rounded-3xl overflow-hidden shadow-2xl relative"
          style={{
            backgroundImage: "url('/images/cta-texture.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Planning an ensemble collection for a wedding?
              </h2>
              <p className="text-gray-200 max-w-lg">
                We customise pieces around your colours, motifs and timeline.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <a
                href="https://wa.me/916006491824"
                target="_blank"
                className="px-6 py-3 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-400 transition"
              >
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="text-sm text-gray-200 hover:underline">
                Or send your requirements →
              </Link>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}

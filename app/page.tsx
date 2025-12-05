"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  // ----------------------------------------------------------------------
  // HERO SLIDER IMAGES
  // ----------------------------------------------------------------------
  const heroImages = [
    "/images/main-banner.jpg",
    "/images/hero-detail-1.jpg",
    "/images/hero-detail-2.jpg",
    "/images/hero-detail-3.jpg",
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % heroImages.length);
    }, 4000); // 4-second auto-slide

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-cream text-gray-900 fade-smooth">

      {/**********************************************************************
       *                             HERO SECTION                            *
       **********************************************************************/}
      <section className="relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden">

        {/* BACKGROUND SLIDES */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 transition-opacity duration-[1500ms]
              ${index === active ? "opacity-100" : "opacity-0"}
            `}
            style={{
              backgroundImage: `url('${img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 animate-shimmer opacity-40" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="fade-smooth">
            <p className="text-sm tracking-[0.28em] uppercase text-gold-500 mb-2">
              The Threads of Paradise
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl mb-2">
              Handcrafted Tilla, Zari, Aari & Dabka
              <br /> Kashmir’s luxury, woven for you.
            </h1>

            <p
              className="text-[#e7c17a] text-3xl md:text-4xl mt-2 mb-6 leading-snug drop-shadow"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
            >
              پوشکار — کشمیر
            </p>

            <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              Poshkaar celebrates centuries-old Kashmiri embroidery,
              reimagined for refined modern wardrobes.
              Every stitch is a promise of artistry, patience and quiet luxury.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <Link href="/collection" className="btn-gold text-gray-900 shadow-xl">
                Explore Collections
              </Link>

              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-gold-500 text-gold-500 hover:bg-gold-500/10 transition font-medium"
              >
                Custom Bridal & Occasionwear
              </Link>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-300">
              <span className="px-3 py-1 border border-white/20 rounded-full">
                Hand-embroidered in Kashmir
              </span>
              <span className="px-3 py-1 border border-white/20 rounded-full">
                Made-to-order available
              </span>
              <span className="px-3 py-1 border border-white/20 rounded-full">
                Worldwide shipping
              </span>
            </div>
          </div>

          {/* RIGHT STATIC IMAGES */}
          <div className="hidden md:grid grid-rows-2 gap-4 fade-smooth">
            <div className="h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 card-shine">
              <img src="/images/hero-detail-1.jpg" className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-4 h-64">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 card-shine">
                <img src="/images/hero-detail-2.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 card-shine">
                <img src="/images/hero-detail-3.jpg" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/**********************************************************************
       *                       SHOP BY CRAFT SECTION                         *
       **********************************************************************/}
      <section className="py-16 max-w-6xl mx-auto px-6 fade-smooth">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Shop by Craft</h2>
            <p className="text-gray-600">
              Explore four signature Kashmiri embroideries crafted by master artisans.
            </p>
          </div>

          <Link href="/collection" className="text-gold-700 font-semibold hover:underline">
            View all collections →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { slug: "tilla", name: "Tilla Work" },
            { slug: "zari", name: "Zari Embroidery" },
            { slug: "aari", name: "Aari Work" },
            { slug: "dabka", name: "Dabka Embroidery" },
          ].map((c) => (
            <Link
              key={c.slug}
              href={`/collection/${c.slug}`}
              className="group rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 hover:shadow-xl transition card-shine"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={`/images/collections/${c.slug}-banner.jpg`}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {c.slug === "tilla"
                    ? "Hand-laid metallic threads for regal silhouettes."
                    : c.slug === "zari"
                    ? "Traditional metallic weaving blended with modern design."
                    : c.slug === "aari"
                    ? "Fine needlework with delicate flowing motifs."
                    : "Rich raised coils for statement couture."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/**********************************************************************
       *                       MINIMAL LUXURY OFFER BANNER                   *
       **********************************************************************/}
      <section className="py-12 fade-smooth flex justify-center">
        <div className="w-[90%] md:w-[60%] px-8 py-6 rounded-3xl bg-[#faf7f2] border border-[#e5dcc7] shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#704214]">
            Buy 2, Get <span className="text-[#b8860b]">10% OFF</span>
          </h2>

          <p className="text-gray-700 mt-2 text-sm md:text-base font-light">
            On all handcrafted Tilla, Zari, Aari & Dabka couture pieces.
          </p>

          <Link
            href="/collection"
            className="inline-block mt-5 px-6 py-2.5 rounded-full border border-[#b8860b]/40 text-[#b8860b] font-medium text-sm hover:bg-[#b8860b]/10 transition-all duration-300"
          >
            Shop Offer →
          </Link>
        </div>
      </section>

      {/**********************************************************************
       *                          EDITOR’S PICKS                             *
       **********************************************************************/}
      <section className="py-16 bg-gray-50 fade-smooth">
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <h2 className="text-3xl font-bold">Editor’s Picks</h2>
          <p className="text-gray-600 mt-2">
            A curated selection capturing the soul and artistry of Poshkaar.
          </p>
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
              className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition block card-shine"
            >
              <div className="h-64 overflow-hidden">
                <img src={p.img} className="w-full h-full object-cover" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gold-700 font-semibold mt-1">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/**********************************************************************
       *                               OUR STORY                              *
       **********************************************************************/}
      <section className="py-20 max-w-6xl mx-auto px-6 fade-smooth">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-700 mb-2">
              Our Story
            </p>

            <h2 className="text-3xl font-bold mb-4">Born in Kashmir. Woven by memory.</h2>

            <p className="text-gray-700 mb-4">
              Poshkaar began not as a brand, but as a feeling — the warmth of a pheran on winter mornings,
              the quiet concentration of an artisan crafting Tilla by hand.
            </p>

            <p className="text-gray-700 mb-4">
              Every piece is handcrafted by master karigars who inherit their
              craft from generations before them.
            </p>

            <p className="text-gray-700">
              When you wear Poshkaar, you carry not just embroidery, but stories
              of mountains, rivers and hands that refuse to rush beauty.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl card-shine">
            <img src="/images/artists.jpg" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/**********************************************************************
       *                            WHY POSHKAAR                             *
       **********************************************************************/}
      <section className="py-20 bg-gray-900 text-gray-100 fade-smooth">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Why Poshkaar?</h2>

          <p className="text-gray-300 mb-10 max-w-xl">
            We create heirloom-worthy pieces designed for those who appreciate timeless elegance.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-700/60">
              <h3 className="font-semibold mb-2">Handcrafted, not mass-made</h3>
              <p className="text-sm text-gray-300">
                Every piece is made with patience and devotion to heritage.
              </p>
            </div>

            <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-700/60">
              <h3 className="font-semibold mb-2">Artisan-first approach</h3>
              <p className="text-sm text-gray-300">
                Fair wages and deep respect for centuries-old craftsmanship.
              </p>
            </div>

            <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-700/60">
              <h3 className="font-semibold mb-2">Quiet luxury ethos</h3>
              <p className="text-sm text-gray-300">
                Limited, considered pieces — crafted to outlast trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/**********************************************************************
       *                             TESTIMONIALS                             *
       **********************************************************************/}
      <section className="py-20 max-w-6xl mx-auto px-6 fade-smooth">
        <h2 className="text-3xl font-bold mb-6 text-center">What our clients say</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-700 mb-4">
              “The Tilla work on my pheran was flawless — a modern heirloom!”
            </p>
            <p className="text-xs font-semibold">— Sana, Srinagar</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-700 mb-4">
              “We ordered coordinated outfits for a wedding. Spectacular quality!”
            </p>
            <p className="text-xs font-semibold">— The Nabi Family</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-700 mb-4">
              “My bridal shawl was exactly what I imagined — thoughtful and elegant.”
            </p>
            <p className="text-xs font-semibold">— Hiba, Dubai</p>
          </div>
        </div>
      </section>

      {/**********************************************************************
       *                              CTA BANNER                              *
       **********************************************************************/}
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
              <p className="text-gray-200 text-base max-w-lg">
                We customise pieces around your colours, motifs and timeline —
                from pherans to full family ensembles.
              </p>
            </div>

            <div className="flex flex-col gap-3 items-center">
              <a
                href="https://wa.me/916006491824"
                target="_blank"
                className="px-6 py-3 rounded-full bg-green-500 text-white font-semibold shadow-lg hover:bg-green-400 transition"
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

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* ===================== HERO ===================== */}
      <section
        className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/gul.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

        <div className="relative text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg tracking-wide">
            About Poshkaar
          </h1>
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
            The Threads of Paradise — celebrating Kashmir’s heritage through
            handcrafted Tilla, Zari, Aari & Dabka embroidery.
          </p>
        </div>
      </section>

      {/* ===================== OUR STORY ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* TEXT */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-yellow-700 mb-3">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Born in Kashmir. Crafted with soul.
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Poshkaar represents the heart of Kashmir — where each motif carries
              stories of mountains, rivers, and generations of master artisans.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Every Tilla, Zari, Aari and Dabka piece is a collaboration of
              skill, patience and heritage. We bring classical embroidery into
              modern silhouettes, creating timeless, wearable artistry.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/gess.jpg"
              alt="Artisan crafting embroidery"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===================== HERITAGE CRAFT ===================== */}
      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* IMAGE */}
          <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-2xl md:order-first order-last">
            <Image
              src="/images/shan.jpg"
              alt="Heritage Kashmiri craftsmanship"
              fill
              className="object-cover"
            />
          </div>

          {/* TEXT */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-yellow-700 mb-3">
              Craftsmanship
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Art of Patience
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Each piece takes anywhere from 40 to 120 hours of meticulous
              handwork — every thread placed with intention and precision.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              By working directly with local artisans, we support livelihoods,
              preserve rare craft skills, and keep Kashmir’s artistic heritage
              alive.
            </p>
          </div>

        </div>
      </section>

      {/* ===================== OUR VALUES ===================== */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The philosophy that guides every thread and motif at Poshkaar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 text-center">

            {/* Value */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">
                Authenticity
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Every piece is handcrafted by Kashmiri artisans using
                centuries-old techniques.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">
                Sustainability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Slow fashion, made-to-order, ethical production, and meaningful
                craftsmanship.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">
                Heritage
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Preserving Kashmir’s cultural legacy through every motif and
                stitch.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-16 md:py-20 text-center">
        <a
          href="/collection"
          className="inline-block bg-yellow-500 text-gray-900 px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-400 transition"
        >
          Explore Our Collection
        </a>
      </section>

    </main>
  );
}

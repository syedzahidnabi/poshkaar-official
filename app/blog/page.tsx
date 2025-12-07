import Link from "next/link";

export const metadata = {
  title: "Journal | Poshkaar Kashmir",
  description:
    "Explore Kashmiri heritage, luxury craftsmanship, pheran styling, and winter fashion through the Poshkaar Journal.",
};

export default function BlogPage() {
  return (
    <main className="bg-[#f7f3ea] min-h-screen">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-20 text-center">
        <p className="uppercase tracking-[0.25em] text-amber-700 text-sm mb-4">
          Poshkaar Journal
        </p>

        <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-900 mb-6">
          Stories of Craft, Culture & Couture
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          A curated space where Kashmiri heritage, handcrafted luxury, and modern
          winter fashion come together.
        </p>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* BLOG CARD 1 */}
        <div className="group bg-[#faf7f1] border border-amber-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="h-56 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <span className="text-amber-800 font-serif text-lg">
              Poshkaar Editorial
            </span>
          </div>

          <div className="p-8">
            <p className="text-xs uppercase tracking-widest text-amber-700 mb-3">
              Heritage • Craft
            </p>

            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-3 leading-snug">
              The Timeless Elegance of the Kashmiri Pheran
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Discover the history, craftsmanship, and modern styling of one of
              the world’s most iconic winter garments.
            </p>

            <Link
              href="/blog/the-timeless-kashmiri-pheran"
              className="inline-flex items-center text-amber-800 font-medium group-hover:gap-3 gap-2 transition-all"
            >
              Read Story <span className="text-xl">→</span>
            </Link>
          </div>
        </div>

        {/* BLOG CARD 3 — AARI vs SOZNI */}
        <div className="group bg-[#faf7f1] border border-amber-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="h-56 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <span className="text-amber-800 font-serif text-lg">
              Embroidery Guide
            </span>
          </div>

          <div className="p-8">
            <p className="text-xs uppercase tracking-widest text-amber-700 mb-3">
              Craft • Heritage
            </p>

            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-3 leading-snug">
              Aari vs Sozni: The Beauty of Kashmiri Hand Embroidery
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Learn the difference between Aari and Sozni embroidery and how each
              style adds beauty to a Kashmiri pheran.
            </p>

            <Link
              href="/blog/aari-vs-sozni-kashmiri-embroidery"
              className="inline-flex items-center text-amber-800 font-medium group-hover:gap-3 gap-2 transition-all"
            >
              Read Story <span className="text-xl">→</span>
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}

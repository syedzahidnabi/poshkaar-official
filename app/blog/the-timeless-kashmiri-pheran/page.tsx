export const metadata = {
  title: "The Timeless Elegance of the Kashmiri Pheran | Poshkaar Kashmir",
  description:
    "Discover the history, beauty, and modern styling of the Kashmiri pheran – a timeless luxury winter garment by Poshkaar Kashmir.",
};

export default function BlogPost() {
  return (
    <main className="bg-[#f7f3ea] min-h-screen">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-20 text-center">
        <p className="uppercase tracking-[0.3em] text-amber-700 text-xs mb-4">
          Poshkaar Journal
        </p>

        <h1 className="text-4xl md:text-6xl font-serif font-semibold text-gray-900 mb-8 leading-tight">
          The Timeless Elegance of the Kashmiri Pheran
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
          A story of warmth, culture, craftsmanship, and modern luxury beautifully
          woven into Kashmir’s most iconic winter garment.
        </p>
      </section>

      {/* FEATURE IMAGE PLACEHOLDER */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="h-[420px] w-full rounded-3xl bg-gradient-to-br from-amber-100 via-[#faf7f1] to-amber-200 flex items-center justify-center shadow-lg">
          <span className="text-amber-800 font-serif text-xl">
            Poshkaar Editorial Feature
          </span>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="max-w-3xl mx-auto px-6 pb-28 text-gray-800">

        <p className="text-lg leading-relaxed mb-10">
          The Kashmiri pheran is more than just winter clothing. It is a symbol of warmth,
          identity, and quiet luxury. For centuries, it has protected people in Kashmir
          from harsh winters. Today, it is admired across the world as a statement of
          timeless elegance.
        </p>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          What is a Kashmiri Pheran?
        </h2>
        <p className="leading-relaxed mb-6">
          A pheran is a long, loose winter garment worn by both men and women in Kashmir.
          It is usually made from premium wool and designed for comfort and warmth.
          Unlike jackets, a pheran feels light, breathable, and graceful.
        </p>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          A Short History of the Pheran
        </h2>
        <p className="leading-relaxed mb-6">
          The pheran has been worn in Kashmir for over 2,000 years. Its roots come from
          Central Asia and Persia. Over time, it became a strong symbol of Kashmiri life.
          Simple pherans were worn daily, while richly embroidered ones were reserved
          for special occasions.
        </p>

        {/* QUOTE BLOCK */}
        <div className="my-16 px-8 py-10 border-l-4 border-amber-700 bg-[#faf7f1] italic text-lg">
          “A pheran is not just worn, it is lived in. It carries warmth, history,
          and identity in every fold.”
        </div>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          Beautiful Kashmiri Embroidery
        </h2>
        <ul className="list-disc ml-6 mb-8 space-y-2">
          <li><b>Aari Work</b> – Fine floral designs created with a hook needle</li>
          <li><b>Sozni Work</b> – Very detailed and delicate needle embroidery</li>
          <li><b>Tilla Work</b> – Traditional embroidery using metallic threads</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          Why Pherans Feel More Luxurious Than Regular Winterwear
        </h2>
        <ul className="list-disc ml-6 mb-8 space-y-2">
          <li>They keep you warm without feeling heavy</li>
          <li>They allow air to flow and feel comfortable all day</li>
          <li>They are handmade using natural materials</li>
          <li>They blend culture with modern fashion</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          How Poshkaar Kashmir Redefines the Pheran
        </h2>
        <p className="leading-relaxed mb-6">
          At Poshkaar Kashmir, we respect tradition while embracing modern design.
          We use premium fabrics, work closely with skilled artisans, and create
          pherans that feel elegant, timeless, and refined for today’s global audience.
        </p>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          Styling the Modern Pheran
        </h2>
        <ul className="list-disc ml-6 mb-8 space-y-2">
          <li>Women can style it with boots, belts, and soft scarves</li>
          <li>Men can wear it with trousers, shawls, and winter accessories</li>
          <li>It works for daily wear, evenings, and special occasions</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          Caring for Your Pheran
        </h2>
        <ul className="list-disc ml-6 mb-12 space-y-2">
          <li>Dry clean only</li>
          <li>Store in a breathable fabric cover</li>
          <li>Avoid direct heat</li>
          <li>Handle embroidery gently</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          Final Thoughts
        </h2>
        <p className="leading-relaxed mb-16">
          The Kashmiri pheran is not just clothing. It is crafted heritage,
          worn with pride and elegance. Through Poshkaar Kashmir, this tradition
          now reaches wardrobes around the world in a form that is both authentic
          and luxurious.
        </p>

        {/* CALL TO ACTION */}
        <div className="mt-10 p-12 border border-amber-200 rounded-3xl text-center bg-[#faf7f1] shadow-md">
          <p className="font-serif text-xl text-gray-900 mb-4">
            Discover the Art of Kashmiri Pherans
          </p>
          <a
            href="/collection"
            className="inline-block mt-2 px-8 py-3 bg-amber-800 text-white rounded-full text-sm tracking-wide hover:bg-amber-900 transition"
          >
            Shop the Collection
          </a>
        </div>

      </section>
    </main>
  );
}

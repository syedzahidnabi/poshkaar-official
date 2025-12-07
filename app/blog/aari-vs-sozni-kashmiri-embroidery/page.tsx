export const metadata = {
  title: "Aari vs Sozni: Understanding Kashmiri Embroidery | Poshkaar Kashmir",
  description:
    "Learn the difference between Aari and Sozni embroidery – two iconic Kashmiri hand-embroidery styles used in luxury pherans.",
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
          Aari vs Sozni:  
          The Beauty of Kashmiri Hand Embroidery
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
          Kashmir is known around the world for its beautiful hand embroidery.
          Among the most loved styles are Aari and Sozni. Both are stunning,
          but each has its own charm, technique, and story.
        </p>
      </section>

      {/* FEATURE IMAGE PLACEHOLDER */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="h-[420px] w-full rounded-3xl bg-gradient-to-br from-amber-100 via-[#faf7f1] to-amber-200 flex items-center justify-center shadow-lg">
          <span className="text-amber-800 font-serif text-xl">
            Kashmiri Embroidery Art
          </span>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="max-w-3xl mx-auto px-6 pb-28 text-gray-800">

        <p className="text-lg leading-relaxed mb-10">
          In Kashmiri fashion, embroidery is not just decoration — it is an art
          passed down through generations. The two most famous styles you will
          often see on pherans, shawls, and luxury garments are Aari and Sozni.
          Let us understand what makes them special and how they are different.
        </p>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          What is Aari Embroidery?
        </h2>
        <p className="leading-relaxed mb-6">
          Aari embroidery is done using a small hooked needle called an Aari.
          It is known for its smooth, flowing floral patterns and bold designs.
          Aari work is usually faster to complete and is often used for
          decorative borders, large motifs, and everyday luxury wear.
        </p>

        <ul className="list-disc ml-6 mb-10 space-y-2">
          <li>Done using a hook needle</li>
          <li>Bold and visible designs</li>
          <li>Faster to complete</li>
          <li>Perfect for daily luxury pherans</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          What is Sozni Embroidery?
        </h2>
        <p className="leading-relaxed mb-6">
          Sozni embroidery is done using a fine hand needle and is known for its
          extremely delicate and detailed work. It takes much longer to complete
          and is used for high-end, ceremonial, and bridal pherans. Sozni work is
          subtle, refined, and very elegant.
        </p>

        <ul className="list-disc ml-6 mb-10 space-y-2">
          <li>Done with a fine hand needle</li>
          <li>Very delicate and detailed</li>
          <li>Slow and time-intensive</li>
          <li>Used for bridal and luxury pieces</li>
        </ul>

        <div className="my-16 px-8 py-10 border-l-4 border-amber-700 bg-[#faf7f1] italic text-lg">
          “Aari catches the eye with bold beauty, while Sozni wins the heart
          with silent elegance.”
        </div>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          Key Differences Between Aari and Sozni
        </h2>

        <ul className="list-disc ml-6 mb-10 space-y-2">
          <li>Aari is bold and Sozni is delicate</li>
          <li>Aari is faster and Sozni is slow and detailed</li>
          <li>Aari suits daily wear and Sozni suits special occasions</li>
          <li>Aari designs are broader, Sozni designs are fine and precise</li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          Which One Should You Choose?
        </h2>
        <p className="leading-relaxed mb-10">
          If you are looking for a stylish pheran for regular wear, Aari embroidery
          is a perfect choice. If you want something truly luxurious for weddings,
          events, or special moments, Sozni embroidery offers unmatched elegance.
        </p>

        <h2 className="text-2xl font-serif font-semibold mt-16 mb-4">
          How Poshkaar Kashmir Uses Aari and Sozni
        </h2>
        <p className="leading-relaxed mb-16">
          At Poshkaar Kashmir, we proudly work with skilled artisans who master both
          Aari and Sozni embroidery. Our collections include bold everyday pherans
          as well as fine luxury pieces — all made with care, heritage, and premium
          quality.
        </p>

        {/* CALL TO ACTION */}
        <div className="mt-10 p-12 border border-amber-200 rounded-3xl text-center bg-[#faf7f1] shadow-md">
          <p className="font-serif text-xl text-gray-900 mb-4">
            Explore Hand-Embroidered Kashmiri Pherans
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

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-900">
      <h1 className="text-3xl font-semibold mb-6 text-gold-700">FAQ</h1>

      <div className="space-y-8">

        <div>
          <h3 className="text-lg font-semibold text-gold-500">
            1. Are all products handcrafted?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Yes. Every Poshkaar piece is hand-embroidered by skilled
            Kashmiri artisans. No machine embroidery is used.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gold-500">
            2. Do you offer custom sizes?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Absolutely. Most pieces can be custom-tailored based on your
            measurements. Use the “Custom Measurements” option on product pages.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gold-500">
            3. How long does custom embroidery take?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Depending on the complexity, handcrafted Tilla/Aari/Dabka
            pieces take between 2–6 weeks.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gold-500">
            4. Do you ship internationally?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Yes. International shipping is available worldwide with
            tracking and insurance options.
          </p>
        </div>

      </div>
    </main>
  );
}

export default function ShippingPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-900">
      <h1 className="text-3xl font-semibold mb-6 text-gold-700">
        Shipping Information
      </h1>

      <p className="text-gray-700 leading-relaxed mb-4">
        At Poshkaar, every piece is handcrafted with precision and requires
        careful finishing. We aim to deliver your order safely and in perfect
        condition.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gold-500">
        Delivery Timelines
      </h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>Made-to-order pieces: 10–20 business days.</li>
        <li>Ready products: 3–7 business days.</li>
        <li>International orders: 10–25 business days depending on region.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gold-500">
        Shipping Charges
      </h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>India: Free shipping on all prepaid orders.</li>
        <li>International: Calculated at checkout based on destination.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gold-500">
        Tracking Your Order
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Once dispatched, your tracking link will be shared via WhatsApp
        and email. You may also contact us directly for updates.
      </p>
    </main>
  );
}

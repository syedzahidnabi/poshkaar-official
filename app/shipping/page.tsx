const sections = [
  {
    title: "Delivery timelines",
    items: [
      "Ready products: usually 3 to 7 business days after confirmation.",
      "Made-to-order pieces: usually 10 to 20 business days, depending on workload and detail.",
      "International orders: usually 10 to 25 business days after dispatch, depending on destination and customs.",
    ],
  },
  {
    title: "Shipping charges",
    items: [
      "India: free shipping on prepaid orders unless a special delivery method is requested.",
      "International: quoted after address confirmation and courier selection.",
    ],
  },
  {
    title: "Tracking",
    items: [
      "Tracking details are shared by WhatsApp or email after dispatch.",
      "For custom orders, Poshkaar confirms the expected dispatch date before payment or production begins.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-14 text-[#171412]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase text-[#8a1538]">
          Customer care
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold">
          Shipping information
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-gray-700">
          Every piece is checked and packed carefully before dispatch. Timelines
          depend on whether the product is ready, altered, or made to order.
        </p>

        <div className="mt-10 space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/10">
              <h2 className="font-serif text-2xl font-bold">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
                {section.items.map((item) => (
                  <li key={item} className="border-l-2 border-[#8a1538] pl-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

const sections = [
  {
    title: "Return policy",
    items: [
      "Returns are accepted only for damaged, defective, or incorrect items.",
      "Requests must be initiated within 48 hours of delivery.",
      "The product must be unused and in original condition.",
    ],
  },
  {
    title: "Exchange policy",
    items: [
      "Size exchanges may be available for select ready products.",
      "Custom-sized, altered, or made-to-order pieces are not exchangeable unless defective.",
    ],
  },
  {
    title: "How to request support",
    items: [
      "Share your order reference, photos of the issue, and unboxing details by WhatsApp or email.",
      "Email: poshkaarofficial@gmail.com",
      "WhatsApp: +91 6006491824",
    ],
  },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-14 text-[#171412]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase text-[#8a1538]">
          Customer care
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold">
          Returns and exchanges
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-gray-700">
          Poshkaar pieces are handcrafted and often made to order. The return
          process is therefore focused on genuine quality issues and incorrect
          dispatches.
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

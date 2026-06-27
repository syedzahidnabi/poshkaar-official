const faqs = [
  {
    question: "Are all products handcrafted?",
    answer:
      "Yes. Poshkaar pieces are made with Kashmiri embroidery techniques such as Tilla, Zari, Aari and Dabka. Some pieces may combine hand and machine-assisted finishing where clearly suitable, but the craft direction remains artisan-led.",
  },
  {
    question: "Do you offer custom sizes?",
    answer:
      "Yes. Most suits, pherans and occasionwear pieces can be custom-tailored. Add measurements on the product page or send them through WhatsApp.",
  },
  {
    question: "How long does custom embroidery take?",
    answer:
      "Custom work usually takes 2 to 6 weeks depending on embroidery density, fabric availability and order queue. Poshkaar confirms the timeline before production.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. International shipping is available. Charges and delivery estimates are confirmed after destination and courier options are reviewed.",
  },
  {
    question: "Which payment methods are available?",
    answer:
      "Checkout supports Razorpay for cards and wallets, UPI where configured, and WhatsApp-assisted ordering for custom confirmation.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-14 text-[#171412]">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase text-[#8a1538]">
          Customer care
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold">
          Frequently asked questions
        </h1>

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <section key={faq.question} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/10">
              <h2 className="font-serif text-2xl font-bold">{faq.question}</h2>
              <p className="mt-3 leading-7 text-gray-700">{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

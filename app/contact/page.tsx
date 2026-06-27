"use client";

import { useState } from "react";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { whatsappNumber } from "@/data/commerce";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const updateForm = (name: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleWhatsApp = () => {
    const text = [
      "Hello Poshkaar",
      "",
      "I would like to make an inquiry.",
      "",
      form.name ? `Name: ${form.name}` : "",
      form.phone ? `Phone: ${form.phone}` : "",
      form.message ? `Message: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <main className="bg-[#f7f4ef] text-[#171412]">
      <section
        className="relative flex min-h-[42svh] items-center overflow-hidden px-6 py-16 text-white"
        style={{
          backgroundImage: "url('/images/hero-main.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/44 to-black/12" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-semibold uppercase text-[#d8b862]">
            Contact
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold md:text-6xl">
            Custom orders, sizing and appointments
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
            Use WhatsApp for the fastest response. Share product names, event
            dates, preferred colors and measurements if available.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/10">
          <h2 className="font-serif text-3xl font-bold">Send an inquiry</h2>
          <div className="mt-6 grid gap-4">
            <label>
              <span className="text-sm font-semibold text-gray-700">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 text-sm outline-none focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
                placeholder="Your full name"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-gray-700">Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 text-sm outline-none focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
                placeholder="+91..."
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-gray-700">Message</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(event) => updateForm("message", event.target.value)}
                className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
                placeholder="Tell us what you need."
              />
            </label>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-green-600 px-5 text-sm font-bold text-white transition hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Send via WhatsApp
            </button>
          </div>
        </div>

        <aside className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/10">
          <h2 className="font-serif text-3xl font-bold">Reach directly</h2>
          <p className="mt-4 leading-7 text-gray-700">
            Poshkaar is based in Kashmir and supports custom orders, bridal
            inquiries, family sets and product availability checks.
          </p>

          <div className="mt-7 space-y-4 text-sm">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md bg-[#f7f4ef] p-3 font-semibold hover:text-[#8a1538]"
            >
              <Phone className="h-5 w-5 text-[#8a1538]" aria-hidden="true" />
              +91 6006491824
            </a>
            <a
              href="mailto:poshkaarofficial@gmail.com"
              className="flex items-center gap-3 rounded-md bg-[#f7f4ef] p-3 font-semibold hover:text-[#8a1538]"
            >
              <Mail className="h-5 w-5 text-[#8a1538]" aria-hidden="true" />
              poshkaarofficial@gmail.com
            </a>
            <a
              href="https://instagram.com/posh__kaar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md bg-[#f7f4ef] p-3 font-semibold hover:text-[#8a1538]"
            >
              <Instagram className="h-5 w-5 text-[#8a1538]" aria-hidden="true" />
              @posh__kaar
            </a>
            <p className="flex items-center gap-3 rounded-md bg-[#f7f4ef] p-3 font-semibold">
              <MapPin className="h-5 w-5 text-[#8a1538]" aria-hidden="true" />
              Srinagar, Kashmir
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

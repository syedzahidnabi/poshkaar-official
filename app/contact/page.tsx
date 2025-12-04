"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, Instagram } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const whatsappNumber = "6006491824";

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const text = `Hello Poshkaar,%0A%0AI would like to make an inquiry.%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  };

  return (
    <main className="bg-white text-gray-900">
      {/* ===================== HERO BANNER ===================== */}
      <section
        className="relative w-full h-[55vh] md:h-[60vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-main.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
            For custom orders, collaborations, or appointments  our team is happy to assist.
            We usually respond within minutes on WhatsApp.
          </p>
        </div>
      </section>

      {/* ===================== FORM & DETAILS ===================== */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* FORM SECTION */}
          <div className="p-8 rounded-2xl shadow-xl border border-gray-200 bg-white">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

            <div className="space-y-5">
              <div>
                <label className="text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="+91…"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition"
              >
                Send via WhatsApp
              </button>
            </div>
          </div>

          {/* DIRECT CONTACT INFO */}
          <div className="p-8 rounded-2xl shadow-xl border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-6">Reach us directly</h2>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Based in Kashmir, crafting luxury Tilla, Zari, Aari & Dabka fashion with
              heritage precision and an artisan-first philosophy.
            </p>

            <div className="space-y-5 text-gray-800">
              <p className="flex items-center gap-3">
                <Phone className="text-yellow-700 w-5 h-5" />
                +91 {whatsappNumber}
              </p>

              <p className="flex items-center gap-3">
                <Mail className="text-yellow-700 w-5 h-5" />
                <a href="mailto:poshkaarofficial@gmail.com" className="text-yellow-700">
                  poshkaarofficial@gmail.com
                </a>
              </p>

              <p className="flex items-center gap-3">
                <Instagram className="text-yellow-700 w-5 h-5" />
                <a href="https://instagram.com/" target="_blank" className="text-yellow-700">
                  posh__kaar
                </a>
              </p>
            </div>

            <div className="mt-8">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="inline-flex items-center gap-3 bg-yellow-600 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
              >
                <img src="/icons/whatsapp.svg" className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

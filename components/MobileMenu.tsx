"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-xl bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold"
      >
        Menu
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SLIDE-IN MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">POSHKAAR</h2>

          <nav className="flex flex-col gap-6 text-lg text-gray-800">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link href="/collection" onClick={() => setOpen(false)}>
              Collection
            </Link>

            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>

            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <a
              href="https://wa.me/9682353599"
              target="_blank"
              className="text-green-700 font-semibold"
              onClick={() => setOpen(false)}
            >
              WhatsApp Us
            </a>
          </nav>

          <button
            className="mt-8 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-black transition"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

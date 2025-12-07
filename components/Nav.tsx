"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  HiMenu,
  HiX,
  HiHome,
} from "react-icons/hi";
import { MdCollections } from "react-icons/md";
import { FaBlog, FaInfoCircle, FaEnvelope } from "react-icons/fa";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getHref = (item: string) => {
    if (item === "Home") return "/";
    if (item === "Collections") return "/collection";
    return `/${item.toLowerCase()}`;
  };

  const menuItems = ["Home", "Collections", "Blog", "About", "Contact"];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* ===== LOGO SECTION ===== */}
          <Link href="/" className="flex items-center gap-3 relative group">
            <img
              src="/logo.png"
              alt="Poshkaar Logo"
              className={`h-12 w-auto transition-all duration-500 ${
                scrolled ? "scale-[0.9] opacity-90" : "scale-100 opacity-100"
              }`}
            />

            <div className="flex flex-col leading-tight">
              <span className="text-[20px] font-serif font-bold text-amber-900 tracking-wide relative">
                Poshkaar
                <span className="absolute inset-0 animate-logoShimmer opacity-0 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent"></span>
              </span>

              <span
                className="text-[18px] -mt-[1px] text-[#b8860b]"
                style={{
                  fontFamily:
                    `'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif`,
                  fontWeight: 400,
                  lineHeight: "1.1",
                }}
              >
                پوشکار  کشمیر
              </span>
            </div>
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <div className="hidden md:flex items-center gap-10 text-[15px] font-medium">
            {menuItems.map((item) => (
              <Link key={item} href={getHref(item)} className="relative group">
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* ===== PREMIUM HAMBURGER BUTTON ===== */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-full bg-[#faf7f1] shadow-md hover:shadow-xl transition"
          >
            <HiMenu className="text-2xl text-amber-900" />
            <span className="absolute inset-0 rounded-full ring-1 ring-amber-200"></span>
          </button>
        </div>

        {/* ✅ ✅ ✅ ICON-ONLY MOBILE NAVBAR — ADDED, NOTHING REMOVED */}
        <div className="md:hidden px-6 pb-3 flex justify-between items-center text-amber-900">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-amber-100"
          >
            <HiHome className="text-lg" />
          </Link>

          <Link
            href="/collection"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-amber-100"
          >
            <MdCollections className="text-lg" />
          </Link>

          <Link
            href="/blog"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-amber-100"
          >
            <FaBlog className="text-sm" />
          </Link>

          <Link
            href="/about"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-amber-100"
          >
            <FaInfoCircle className="text-sm" />
          </Link>

          <Link
            href="/contact"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-amber-100"
          >
            <FaEnvelope className="text-sm" />
          </Link>
        </div>
      </nav>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        >
          {/* ================= SLIDE-IN DRAWER ================= */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute right-0 top-0 h-full w-[78%] max-w-xs bg-[#faf7f1] shadow-2xl p-8 flex flex-col justify-between transform transition-transform duration-500 ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* ===== DRAWER HEADER ===== */}
            <div className="flex items-center justify-between mb-10">
              <span className="font-serif text-lg text-amber-900">
                Poshkaar Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:rotate-90 transition-all"
              >
                <HiX className="text-xl text-gray-700" />
              </button>
            </div>

            {/* ===== DRAWER LINKS ===== */}
            <div className="flex flex-col gap-6 text-lg">
              {menuItems.map((item) => (
                <Link
                  key={item}
                  href={getHref(item)}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between text-gray-800 hover:text-amber-800 transition"
                >
                  {item}
                  <span className="text-amber-700">→</span>
                </Link>
              ))}
            </div>

            {/* ===== DRAWER FOOTER ===== */}
            <div className="mt-12 pt-6 border-t text-sm text-gray-500">
              © {new Date().getFullYear()} Poshkaar Kashmir  
              <div className="mt-2 text-amber-800">
                Crafted with heritage & luxury
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

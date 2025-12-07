"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

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
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO SECTION */}
          <Link href="/" className="flex items-center gap-3 relative group">
            
            {/* GOLD P LOGO */}
            <img
              src="/logo.png"
              alt="Poshkaar Logo"
              className={`h-12 w-auto transition-all duration-500 ${
                scrolled ? "scale-[0.9] opacity-90" : "scale-100 opacity-100"
              }`}
            />

            {/* TEXT BLOCK */}
            <div className="flex flex-col leading-tight">

              {/* POSHKAAR MAIN TEXT */}
              <span className="text-[20px] font-serif font-bold text-amber-900 tracking-wide relative">
                Poshkaar
                <span className="absolute inset-0 animate-logoShimmer opacity-0 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent"></span>
              </span>

              {/* URDU NAME */}
              <span
                className="text-[18px] -mt-[1px] text-[#b8860b]"
                style={{
                  fontFamily: `'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif`,
                  fontWeight: 400,
                  lineHeight: "1.1",
                }}
              >
                پوشکار  کشمیر
              </span>

            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10 text-[15px] font-medium">
            {menuItems.map((item) => (
              <Link key={item} href={getHref(item)} className="relative group">
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-3xl text-amber-900"
          >
            <HiMenu />
          </button>

        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 fade-smooth">
          <div className="absolute right-0 top-0 bg-white h-full w-64 shadow-xl p-6 space-y-6">
            
            <button
              onClick={() => setOpen(false)}
              className="text-3xl text-gray-700 mb-6"
            >
              <HiX />
            </button>

            {menuItems.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                className="block text-lg text-gray-800"
                onClick={() => setOpen(false)}
              >
                {item}
              </Link>
            ))}

          </div>
        </div>
      )}
    </>
  );
}

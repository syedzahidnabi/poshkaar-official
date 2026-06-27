

"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";

const links = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collection" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  const cartLabel = `Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`;

  const menuItems = ["Home", "Collections", "Blog", "About", "Contact"];

  return (
    <>
<<<<<<< HEAD
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
=======
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Poshkaar home">
>>>>>>> 4c42ba2 (Describe your changes)
            <img
              src="/logo.png"
              alt="Poshkaar"
              className="h-11 w-auto"
            />
<<<<<<< HEAD

            <div className="flex flex-col leading-tight">
              <span className="text-[20px] font-serif font-bold text-amber-900 tracking-wide relative">
=======
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-xl font-bold text-[#171412]">
>>>>>>> 4c42ba2 (Describe your changes)
                Poshkaar
              </span>
<<<<<<< HEAD

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
=======
              <span className="text-xs font-semibold uppercase text-[#8a1538]">
                Kashmir couture
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#171412] md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[#8a1538]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/10 bg-white text-[#171412] transition hover:border-[#8a1538] hover:text-[#8a1538]"
              aria-label={cartLabel}
              title="Cart"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#8a1538] px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/10 bg-white text-[#171412] md:hidden"
              aria-label="Open menu"
              title="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
>>>>>>> 4c42ba2 (Describe your changes)
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[86vw] bg-white shadow-2xl">
            <div className="flex h-20 items-center justify-between border-b border-black/10 px-5">
              <span className="font-serif text-xl font-bold">Poshkaar</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10"
                aria-label="Close menu"
                title="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="grid gap-1 p-5">
              {[...links, { label: "Cart", href: "/cart" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-base font-semibold text-[#171412] hover:bg-[#f7f4ef]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  {link.href === "/cart" && itemCount > 0 && (
                    <span className="rounded-full bg-[#8a1538] px-2 py-0.5 text-xs text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}



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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Poshkaar home">
            <img src="/logo.png" alt="Poshkaar" className="h-11 w-auto" />
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-xl font-bold text-[#171412]">
                Poshkaar
              </span>
              <span className="text-xs font-semibold uppercase text-[#8a1538]">
                Kashmir couture
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#171412] md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#8a1538]">
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

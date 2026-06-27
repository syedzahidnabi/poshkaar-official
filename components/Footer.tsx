import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { craftCollections, whatsappNumber } from "@/data/commerce";

export default function Footer() {
  return (
    <footer className="bg-[#171412] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <h3 className="font-serif text-3xl font-bold text-[#d8b862]">
            Poshkaar
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/68">
            Handcrafted Kashmiri couture for customers who value craft, detail
            and wardrobe pieces that stay meaningful beyond a single season.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-white/72">
            <ShieldCheck className="h-4 w-4 text-[#0f6f68]" aria-hidden="true" />
            Razorpay, UPI and WhatsApp assisted checkout
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase text-[#d8b862]">Shop</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/72">
            <li><Link href="/collection" className="hover:text-white">All collections</Link></li>
            {craftCollections.map((collection) => (
              <li key={collection.slug}>
                <Link href={`/collection/${collection.slug}`} className="hover:text-white">
                  {collection.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase text-[#d8b862]">Care</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/72">
            <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white">Custom orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase text-[#d8b862]">Contact</h4>
          <div className="mt-4 space-y-3 text-sm text-white/72">
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#d8b862]" aria-hidden="true" />
              Srinagar, Kashmir
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-[#d8b862]" aria-hidden="true" />
              +91 6006491824
            </a>
            <a href="mailto:poshkaarofficial@gmail.com" className="flex items-center gap-3 hover:text-white">
              <Mail className="h-4 w-4 text-[#d8b862]" aria-hidden="true" />
              poshkaarofficial@gmail.com
            </a>
            <a
              href="https://instagram.com/posh__kaar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-white"
            >
              <Instagram className="h-4 w-4 text-[#d8b862]" aria-hidden="true" />
              @posh__kaar
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/48">
        Copyright {new Date().getFullYear()} Poshkaar. All rights reserved.
      </div>
    </footer>
  );
}

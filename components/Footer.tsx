import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f0d0c] text-gray-300 py-14 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h3 className="font-serif text-2xl text-gold-500 mb-3">Poshkaar</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Rooted in Kashmir’s centuries-old tradition of fine embroidery.
            Every piece is crafted with patience, respect and quiet luxury.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="text-gold-500 font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/collection" className="hover:text-gold-500">Collections</Link></li>
            <li><Link href="/about" className="hover:text-gold-500">Our Story</Link></li>
            <li><Link href="/contact" className="hover:text-gold-500">Custom Ordering</Link></li>
          </ul>
        </div>

        {/* CUSTOMER */}
        <div>
          <h4 className="text-gold-500 font-semibold mb-3">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shipping" className="hover:text-gold-500">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-gold-500">Returns</Link></li>
            <li><Link href="/faq" className="hover:text-gold-500">FAQ</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-gold-500 font-semibold mb-3">Contact</h4>
          <p className="text-sm text-gray-400 mb-2">Srinagar, Kashmir</p>
          <p className="text-sm text-gray-400 mb-2">+91 6006491824</p>
          <a
            href="mailto:poshkaarofficial@gmail.com"
            className="text-sm hover:text-gold-500"
          >
            poshkaarofficial@gmail.com
          </a>
        </div>

      </div>

      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Poshkaar. All Rights Reserved.
      </div>
    </footer>
  );
}

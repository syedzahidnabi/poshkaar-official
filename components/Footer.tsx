import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import {
  SiVisa,
  SiMastercard,
  SiRazorpay,
  SiGooglepay,
  SiPaypal,
} from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#0f0d0c] text-gray-300 pt-16 pb-10 mt-20 border-t border-[#2a2523]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-14">

        {/* BRAND + SOCIAL ICONS */}
        <div>
          <h3 className="font-serif text-3xl text-gold-500 mb-4">Poshkaar</h3>

          <p className="text-sm leading-relaxed text-gray-400">
            Rooted in Kashmir’s centuries-old tradition of fine embroidery.
            Every piece is crafted with patience, respect and quiet luxury.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-5">
            <Social icon={<FaInstagram />} link="https://instagram.com/posh__kaar" />
            <Social icon={<FaFacebookF />} link="https://facebook.com/poshkaar" />
            <Social icon={<FaWhatsapp />} link="https://wa.me/916006491824" />
            <Social icon={<FaYoutube />} link="https://youtube.com/@poshkaar" />
            <Social icon={<FaPinterestP />} link="https://pinterest.com/poshkaarkashmir" />
            <Social icon={<FaLinkedinIn />} link="https://linkedin.com/company/poshkaar-kashmir" />
            <Social icon={<FaXTwitter />} link="https://twitter.com/poshkaarkashmir" />
          </div>

          {/* BADGE */}
          <div className="mt-5 inline-block border border-gold-700 px-3 py-1 rounded-full text-xs text-gold-500">
            🇮🇳 Made in Kashmir
          </div>
        </div>

        {/* EXPLORE SECTION */}
        <div>
          <h4 className="text-gold-500 font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><FooterLink href="/collection">Collections</FooterLink></li>
            <li><FooterLink href="/about">Our Story</FooterLink></li>
            <li><FooterLink href="/contact">Custom Ordering</FooterLink></li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h4 className="text-gold-500 font-semibold mb-4">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><FooterLink href="/shipping">Shipping</FooterLink></li>
            <li><FooterLink href="/returns">Returns</FooterLink></li>
            <li><FooterLink href="/faq">FAQ</FooterLink></li>
          </ul>
        </div>

        {/* NEWSLETTER + CONTACT */}
        <div>
          <h4 className="text-gold-500 font-semibold mb-4">Join Our Newsletter</h4>

          <form className="flex items-center bg-[#1b1918] border border-[#2e2a28] rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent text-sm text-gray-300 px-3 py-2 w-full outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gold-600 text-gray-900 font-semibold hover:bg-gold-500 transition"
            >
              Join
            </button>
          </form>

          {/* CONTACT INFO */}
          <div className="mt-6 text-sm">
            <p className="text-gray-400">Srinagar, Kashmir</p>
            <p className="text-gray-400">+91 6006491824</p>

            <a
              href="mailto:poshkaarofficial@gmail.com"
              className="hover:text-gold-500"
            >
              poshkaarofficial@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="max-w-7xl mx-auto px-6 mt-14">
        <h4 className="text-gold-500 text-sm font-semibold mb-3">We Accept</h4>

        <div className="flex flex-wrap items-center gap-6 text-3xl text-gray-400">
          <SiVisa className="hover:text-gold-500 transition" />
          <SiMastercard className="hover:text-gold-500 transition" />
          <SiRazorpay className="hover:text-gold-500 transition" />
          <SiGooglepay className="hover:text-gold-500 transition" />
          <SiPaypal className="hover:text-gold-500 transition" />
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Poshkaar. All Rights Reserved.
      </div>
    </footer>
  );
}

/* Helpers */
function Social({ icon, link }: { icon: React.ReactNode; link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      className="text-gray-400 hover:text-gold-500 text-xl transition"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: any) {
  return <Link href={href} className="hover:text-gold-500">{children}</Link>;
}

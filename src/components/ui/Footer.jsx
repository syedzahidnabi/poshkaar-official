import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="font-serif text-3xl tracking-[0.2em] uppercase mb-4 block">
              Poshkaar
            </Link>
            <p className="font-serif italic text-brand-stone text-lg mb-6">
              The threads of paradise.
            </p>
            <p className="font-sans text-sm text-brand-stone/80 max-w-sm leading-relaxed">
              Keeping Kashmiri embroidery alive with careful work by skilled artists from Shopian.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-stone mb-6">
              Explore
            </h4>
            <ul className="space-y-4 font-sans text-sm text-brand-stone/80">
              <li><Link to="/" className="hover:text-brand-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-brand-white transition-colors">Shop</Link></li>
              <li><Link to="/collections" className="hover:text-brand-white transition-colors">Collections</Link></li>
              <li><Link to="/our-story" className="hover:text-brand-white transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Client Services Column */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-stone mb-6">
              Assistance
            </h4>
            <ul className="space-y-4 font-sans text-sm text-brand-stone/80">
              <li><Link to="/about" className="hover:text-brand-white transition-colors">About</Link></li>
              <li><Link to="/search" className="hover:text-brand-white transition-colors">Search</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-white transition-colors">Wishlist</Link></li>
              <li><Link to="/account" className="hover:text-brand-white transition-colors">My Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-stone/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-sans text-brand-stone/60">
          <p>&copy; {new Date().getFullYear()} Poshkaar. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-brand-white transition-colors">Instagram</Link>
            <Link to="#" className="hover:text-brand-white transition-colors">Pinterest</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

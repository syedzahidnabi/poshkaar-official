import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function MobileMenu({ isOpen, setIsOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-brand-white p-8 lg:hidden flex flex-col"
        >
          {/* Close Button */}
          <div className="flex justify-end mb-12">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-brand-charcoal hover:text-brand-black transition-colors"
            >
              <X className="h-8 w-8 stroke-[1.5]" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-8 font-serif text-4xl text-brand-black">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-brand-charcoal transition-colors">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="hover:text-brand-charcoal transition-colors">Shop</Link>
            <Link to="/collections" onClick={() => setIsOpen(false)} className="hover:text-brand-charcoal transition-colors">Collections</Link>
            <Link to="/our-story" onClick={() => setIsOpen(false)} className="hover:text-brand-charcoal transition-colors">Our Story</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-brand-charcoal transition-colors">About</Link>
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="hover:text-brand-charcoal transition-colors">Wishlist</Link>
          </nav>

          {/* Mobile Footer Branding */}
          <div className="mt-auto pb-8 border-t border-brand-stone/50 pt-8 font-sans text-xs text-brand-charcoal uppercase tracking-widest">
            <p>The threads of paradise.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
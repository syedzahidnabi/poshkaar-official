import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import CartDrawer from './CartDrawer'; 
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Bring in cartItems to calculate the badge number
  const { isCartOpen, setIsCartOpen, cartItems } = useCart(); 

  // Calculate total quantity of items in the bag
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-brand-white/90 backdrop-blur-md border-b border-brand-stone/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex items-center flex-1">
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="text-brand-charcoal hover:text-brand-black transition-colors p-2 -ml-2"
              >
                <Menu className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center">
              <Link to="/" className="font-serif text-2xl tracking-[0.2em] text-brand-black uppercase">
                Poshkaar
              </Link>
            </div>

            <div className="hidden lg:flex items-center justify-center space-x-8 flex-1">
              <Link to="/shop" className="font-sans text-sm uppercase tracking-[0.3em] text-brand-charcoal hover:text-brand-black transition-colors">
                Shop
              </Link>
              <Link to="/collections" className="font-sans text-sm uppercase tracking-[0.3em] text-brand-charcoal hover:text-brand-black transition-colors">
                Collections
              </Link>
              <Link to="/our-story" className="font-sans text-sm uppercase tracking-[0.3em] text-brand-charcoal hover:text-brand-black transition-colors">
                Our Story
              </Link>
              <Link to="/about" className="font-sans text-sm uppercase tracking-[0.3em] text-brand-charcoal hover:text-brand-black transition-colors">
                About
              </Link>
            </div>

            <div className="flex items-center justify-end space-x-6 flex-1">
              <Link to="/search" className="text-brand-charcoal hover:text-brand-black transition-colors hidden sm:block">
                <Search className="h-5 w-5 stroke-[1.5]" />
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-brand-charcoal hover:text-brand-black transition-colors relative"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {/* Dynamic Cart Badge */}
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-black text-[9px] text-brand-white ring-2 ring-brand-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} /> 
    </>
  );
}
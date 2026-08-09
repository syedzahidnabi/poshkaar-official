import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/formatPrice';
import LuxuryButton from './LuxuryButton';
import useFocusTrap from '@/hooks/useFocusTrap';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const drawerRef = useFocusTrap(isOpen);

  const freeShippingThreshold = 15000;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-charcoal/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={drawerRef}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md glass-effect z-50 flex flex-col border-l border-gold/10"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-charcoal" />
                <span className="font-display text-lg tracking-wider uppercase text-charcoal">
                  Your Bag
                </span>
                <span className="text-[10px] text-muted-foreground tracking-wider">({totalItems})</span>
              </div>
              <button className="flex h-11 w-11 items-center justify-end" onClick={() => setIsOpen(false)} aria-label="Close cart">
                <X size={18} className="text-charcoal hover:text-burgundy luxury-transition" />
              </button>
            </div>

            {/* Free shipping progress */}
            {subtotal < freeShippingThreshold && subtotal > 0 && (
              <div className="px-6 py-4 bg-beige/50">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={12} className="text-gold" />
                  <p className="text-[10px] tracking-wider text-charcoal">
                    {formatPrice(freeShippingThreshold - subtotal)} away from free shipping
                  </p>
                </div>
                <div className="h-0.5 bg-gold/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={40} className="text-gold/30 mb-4" />
                  <p className="font-display text-xl text-charcoal mb-2">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">Explore our handmade pieces</p>
                  <LuxuryButton variant="secondary" onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </LuxuryButton>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.div
                        key={`${item.product_id}-${item.size}-${item.color}`}
                        className="flex gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={`/product/${item.product_id}`}
                          onClick={() => setIsOpen(false)}
                          className="w-20 h-24 bg-beige shrink-0 overflow-hidden"
                        >
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-sm text-charcoal truncate">{item.title}</h4>
                          <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">
                            {item.size && `Size: ${item.size}`}{item.size && item.color && ' | '}{item.color && `${item.color}`}
                          </p>
                          <p className="text-sm text-charcoal mt-1">{formatPrice(item.price)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gold/20">
                              <button
                                onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)}
                                className="flex h-10 w-10 items-center justify-center hover:bg-beige luxury-transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-9 text-center text-xs" aria-live="polite">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)}
                                disabled={item.stock_quantity !== null && item.stock_quantity !== undefined && Number.isFinite(Number(item.stock_quantity)) && item.quantity >= Number(item.stock_quantity)}
                                className="flex h-10 w-10 items-center justify-center hover:bg-beige luxury-transition disabled:cursor-not-allowed disabled:opacity-35"
                                aria-label="Increase quantity"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product_id, item.size, item.color)}
                              className="min-h-10 px-2 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-burgundy luxury-transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gold/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal">Subtotal</span>
                  <span className="font-display text-lg text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground tracking-wider">
                  Shipping and taxes are calculated at checkout
                </p>
                <Link to="/checkout" onClick={() => setIsOpen(false)}>
                  <LuxuryButton variant="primary" className="w-full">
                    Proceed to Checkout
                  </LuxuryButton>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-[10px] tracking-[0.2em] uppercase text-charcoal hover:text-burgundy luxury-transition py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

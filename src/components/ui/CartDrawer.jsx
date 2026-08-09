import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import the global state

export default function CartDrawer({ isOpen, setIsOpen }) {
  // Extract the dynamic data and functions from our Context
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-brand-black/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-brand-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-brand-stone/50">
              <h2 className="font-serif text-2xl text-brand-black flex items-center">
                <ShoppingBag className="mr-3 h-5 w-5" /> Your Bag
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-brand-charcoal hover:text-brand-black transition-colors p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-brand-charcoal/60">
                  <ShoppingBag className="h-12 w-12 mb-4 stroke-[1]" />
                  <p className="font-sans text-sm uppercase tracking-widest">Your bag is empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-8 border-b border-brand-charcoal text-brand-charcoal hover:text-brand-black hover:border-brand-black transition-all font-sans text-sm pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-6 border-b border-brand-stone/30 pb-6">
                      {/* Product Image */}
                      <div className="h-32 w-24 flex-shrink-0 overflow-hidden bg-brand-stone">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Product Info & Controls */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-brand-black">
                          <h3 className="font-serif text-lg">
                            <Link to={`/product/${item.id}`} onClick={() => setIsOpen(false)}>
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4 font-sans text-sm">{item.price}</p>
                        </div>
                        <p className="mt-1 font-sans text-xs text-brand-charcoal/70">Authentic Hand Embroidery</p>
                        
                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-brand-stone">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-brand-charcoal hover:text-brand-black transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-sans text-xs px-2 w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-brand-charcoal hover:text-brand-black transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {/* Remove Button */}
                          <button 
                            type="button" 
                            onClick={() => removeFromCart(item.id)}
                            className="font-sans text-xs uppercase tracking-widest text-brand-charcoal underline underline-offset-4 hover:text-brand-black transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-brand-stone/50 px-6 py-8 bg-brand-white">
                <div className="flex justify-between font-sans text-base text-brand-black mb-4">
                  <p className="uppercase tracking-widest text-xs font-semibold">Subtotal</p>
                  <p className="font-medium">
                    {/* Format the numeric subtotal back to INR currency format */}
                    ₹{subtotal.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="font-sans text-xs text-brand-charcoal/60 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  className="w-full bg-brand-black text-brand-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-brand-charcoal transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
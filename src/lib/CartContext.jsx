import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { normalizeImageList } from '@/lib/imageUtils';
import {
  addCartItem,
  calculateCartSubtotal,
  removeCartItem,
  updateCartItemQuantity,
} from '@/lib/commerce';
import { productToAnalyticsItem, trackEvent } from '@/lib/analytics';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'poshkaar_cart_v1';

function loadStoredCart() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(stored)) return [];

    return stored.filter((item) => (
      item &&
      item.product_id &&
      item.title &&
      Number.isFinite(Number(item.price)) &&
      Number(item.quantity) > 0
    ));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadStoredCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, size, color, quantity = 1) => {
    const cartProduct = {
      ...product,
      image: normalizeImageList(product.images)[0] || '',
    };
    setItems((previousItems) => addCartItem(previousItems, cartProduct, size, color, quantity));
    trackEvent('add_to_cart', {
      currency: 'INR',
      value: (Number(product.price) || 0) * Number(quantity || 1),
      items: [productToAnalyticsItem(product, { size, color, quantity })],
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((product_id, size, color, quantity) => {
    setItems((previousItems) => (
      updateCartItemQuantity(previousItems, product_id, size, color, quantity)
    ));
  }, []);

  const removeItem = useCallback((product_id, size, color) => {
    setItems((previousItems) => removeCartItem(previousItems, product_id, size, color));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = calculateCartSubtotal(items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen, addItem, updateQuantity, removeItem, clearCart,
      subtotal, totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

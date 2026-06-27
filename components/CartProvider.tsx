"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import {
  getCartDiscount,
  getCartItemCount,
  getCartSubtotal,
  getCartTotal,
  parsePrice,
} from "@/lib/price";

const STORAGE_KEY = "poshkaar-cart-v1";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  category: Product["category"];
  price: string;
  unitPrice: number;
  image: string;
  color?: string;
  measurements?: Record<string, string>;
  quantity: number;
  addedAt: string;
};

type AddToCartOptions = {
  color?: string;
  measurements?: Record<string, string> | null;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  isLoaded: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  addItem: (product: Product, options?: AddToCartOptions) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function cleanMeasurements(
  measurements?: Record<string, string> | null
): Record<string, string> | undefined {
  if (!measurements) return undefined;

  const entries = Object.entries(measurements).filter(([, value]) =>
    Boolean(value?.trim())
  );

  return entries.length ? Object.fromEntries(entries) : undefined;
}

function makeCartItemId(
  productId: string,
  color?: string,
  measurements?: Record<string, string>
) {
  return [productId, color || "default", JSON.stringify(measurements || {})].join(
    "::"
  );
}

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isLoaded, items]);

  const addItem = useCallback(
    (product: Product, options: AddToCartOptions = {}) => {
      const measurements = cleanMeasurements(options.measurements);
      const quantity = Math.max(1, options.quantity || 1);
      const id = makeCartItemId(product.id, options.color, measurements);

      setItems((current) => {
        const existing = current.find((item) => item.id === id);

        if (existing) {
          return current.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        const item: CartItem = {
          id,
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          unitPrice: parsePrice(product.price),
          image: product.image,
          color: options.color,
          measurements,
          quantity,
          addedAt: new Date().toISOString(),
        };

        return [...current, item];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => {
      const nextQuantity = Math.max(0, quantity);

      if (nextQuantity === 0) {
        return current.filter((item) => item.id !== id);
      }

      return current.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = getCartItemCount(items);
    const subtotal = getCartSubtotal(items);
    const discount = getCartDiscount(items);
    const total = getCartTotal(items);

    return {
      items,
      isLoaded,
      itemCount,
      subtotal,
      discount,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [
    addItem,
    clearCart,
    isLoaded,
    items,
    removeItem,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

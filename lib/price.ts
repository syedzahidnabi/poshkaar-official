import type { CartItem } from "@/components/CartProvider";

export function parsePrice(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartDiscount(items: CartItem[]): number {
  const itemCount = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);

  return itemCount >= 2 ? Math.round(subtotal * 0.1) : 0;
}

export function getCartTotal(items: CartItem[]): number {
  return Math.max(0, getCartSubtotal(items) - getCartDiscount(items));
}

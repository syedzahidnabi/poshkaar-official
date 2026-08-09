import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCartItem,
  calculateCheckoutTotals,
  removeCartItem,
  updateCartItemQuantity,
} from './commerce.js';

const product = {
  id: 'kurti-01',
  title: 'Midnight Kurti',
  price: 7250,
  compare_at_price: 8000,
  image: '/images/product.jpg',
  category: 'Kurtis',
};

test('adds a product and merges only an identical variant', () => {
  const first = addCartItem([], product, 'S', 'Midnight', 1);
  const merged = addCartItem(first, product, 'S', 'Midnight', 2);
  const secondVariant = addCartItem(merged, product, 'M', 'Midnight', 1);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].quantity, 3);
  assert.equal(secondVariant.length, 2);
  assert.equal(secondVariant[1].size, 'M');
});

test('updates quantity and removes an item when quantity reaches zero', () => {
  const items = addCartItem([], product, 'S', 'Midnight', 1);
  const updated = updateCartItemQuantity(items, product.id, 'S', 'Midnight', 4);
  const removed = updateCartItemQuantity(updated, product.id, 'S', 'Midnight', 0);

  assert.equal(updated[0].quantity, 4);
  assert.deepEqual(removed, []);
});

test('removes only the selected product variant', () => {
  const small = addCartItem([], product, 'S', 'Midnight', 1);
  const twoVariants = addCartItem(small, product, 'M', 'Midnight', 1);
  const remaining = removeCartItem(twoVariants, product.id, 'S', 'Midnight');

  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].size, 'M');
});

test('calculates paid shipping below the threshold', () => {
  const items = addCartItem([], product, 'S', 'Midnight', 2);
  assert.deepEqual(calculateCheckoutTotals(items), {
    subtotal: 14500,
    shipping: 500,
    giftWrapping: 0,
    total: 15000,
  });
});

test('calculates free shipping and optional gift wrapping', () => {
  const items = addCartItem([], product, 'S', 'Midnight', 3);
  assert.deepEqual(calculateCheckoutTotals(items, true), {
    subtotal: 21750,
    shipping: 0,
    giftWrapping: 299,
    total: 22049,
  });
});

test('does not add sold-out products and never exceeds available stock', () => {
  const soldOut = addCartItem([], { ...product, stock_quantity: 0 }, 'S', 'Midnight', 1);
  const limited = addCartItem([], { ...product, stock_quantity: 2 }, 'S', 'Midnight', 5);
  const merged = addCartItem(limited, { ...product, stock_quantity: 2 }, 'S', 'Midnight', 2);
  const updated = updateCartItemQuantity(merged, product.id, 'S', 'Midnight', 10);

  assert.deepEqual(soldOut, []);
  assert.equal(limited[0].quantity, 2);
  assert.equal(merged[0].quantity, 2);
  assert.equal(updated[0].quantity, 2);
});

import { normalizeImageList } from '@/lib/imageUtils';

const WISHLIST_STORAGE_KEY = 'poshkaar_wishlist_v1';
const WISHLIST_EVENT = 'poshkaar:wishlist-change';

const isBrowser = () => typeof window !== 'undefined';

const readWishlist = () => {
  if (!isBrowser()) return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((item) => item?.product_id && item?.title) : [];
  } catch {
    return [];
  }
};

const writeWishlist = (items) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: items }));
};

export const getWishlistItems = () => readWishlist();

export const isProductWishlisted = (productId) =>
  readWishlist().some((item) => item.product_id === productId);

export const addWishlistItem = (product) => {
  const currentItems = readWishlist();
  if (currentItems.some((item) => item.product_id === product.id)) return currentItems;

  const nextItems = [
    {
      id: `local-${product.id}`,
      product_id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      image: normalizeImageList(product.images)[0] || product.image || '',
      category: product.category || product.embroidery_type || 'Collection',
      local: true,
      created_date: new Date().toISOString(),
    },
    ...currentItems,
  ];

  writeWishlist(nextItems);
  return nextItems;
};

export const removeWishlistItem = (productId) => {
  const nextItems = readWishlist().filter((item) => item.product_id !== productId);
  writeWishlist(nextItems);
  return nextItems;
};

export const subscribeToWishlist = (callback) => {
  if (!isBrowser()) return () => {};

  const listener = (event) => callback(event.detail || readWishlist());
  window.addEventListener(WISHLIST_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(WISHLIST_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
};

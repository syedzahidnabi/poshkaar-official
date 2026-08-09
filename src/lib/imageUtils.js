const IMAGE_OBJECT_KEYS = [
  'url',
  'src',
  'path',
  'public_url',
  'publicUrl',
  'file_url',
  'fileUrl',
  'image_url',
  'imageUrl',
  'secure_url',
  'secureUrl',
];

export const DEFAULT_PRODUCT_IMAGE = '/images/product-placeholder.svg';

export function normalizeImageUrl(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim().replace(/\\/g, '/');
    if (!trimmed || trimmed === '0' || trimmed === 'null' || trimmed === 'undefined') return '';
    if (trimmed.startsWith('//')) return `https:${trimmed}`;
    if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('/')) return trimmed;
    if (trimmed.startsWith('public/')) return `/${trimmed.slice('public/'.length)}`;
    if (trimmed.startsWith('images/')) return `/${trimmed}`;
    if (/\.(jpe?g|png|webp|gif|svg)$/i.test(trimmed)) return `/images/${trimmed}`;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const image = normalizeImageUrl(item);
      if (image) return image;
    }
  }

  if (value && typeof value === 'object') {
    for (const key of IMAGE_OBJECT_KEYS) {
      const image = normalizeImageUrl(value[key]);
      if (image) return image;
    }
  }

  return '';
}

export function normalizeImageList(images, fallback = []) {
  const values = Array.isArray(images) ? images : [images];
  const normalized = [];

  for (const value of values) {
    const image = normalizeImageUrl(value);
    if (image && !normalized.includes(image)) normalized.push(image);
  }

  if (normalized.length > 0) return normalized;

  return fallback
    .map((image) => normalizeImageUrl(image))
    .filter(Boolean);
}

export function getLocalWebpSrcSet(src, widths = [1200, 800]) {
  const image = normalizeImageUrl(src);
  const match = image.match(/^\/images\/(.+)\.(?:jpe?g|png)$/i);
  if (!match) return '';

  const relativePath = match[1];
  return widths.map((width) => `/images/webp/${relativePath}-${width}.webp ${width}w`).join(', ');
}

export function hasCompareAtPrice(product) {
  const price = Number(product?.price);
  const compareAtPrice = Number(product?.compare_at_price);
  return Number.isFinite(price) && Number.isFinite(compareAtPrice) && compareAtPrice > price;
}

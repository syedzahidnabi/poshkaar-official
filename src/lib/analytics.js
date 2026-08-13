export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || 'G-P9ZL3YRLQ7';

let initialized = false;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function initAnalytics() {
  if (!isBrowser() || initialized || !GA_MEASUREMENT_ID) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const existingScript = document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  initialized = true;
  return true;
}

export function trackPageView(path, title = document.title) {
  if (!initAnalytics()) return;
  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: window.location.href,
    page_path: path,
  });
}

export function trackEvent(name, params = {}) {
  if (!initAnalytics()) return;
  window.gtag('event', name, params);
}

export function productToAnalyticsItem(product, overrides = {}) {
  if (!product) return {};

  return {
    item_id: product.sku || product.id || product.product_id,
    item_name: product.title,
    item_brand: 'Poshkaar Kashmir',
    item_category: product.category || product.collection || product.craft,
    item_variant: [overrides.size, overrides.color].filter(Boolean).join(' / ') || undefined,
    price: Number(product.price) || 0,
    quantity: Number(overrides.quantity || product.quantity || 1),
  };
}

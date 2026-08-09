import { formatPrice } from '@/lib/formatPrice';

const DEFAULT_WHATSAPP_ORDER_NUMBER = '916006491824';

export const WHATSAPP_ORDER_NUMBER = String(
  import.meta.env.VITE_WHATSAPP_ORDER_NUMBER
  || import.meta.env.VITE_POSHKAAR_WHATSAPP
  || DEFAULT_WHATSAPP_ORDER_NUMBER
).replace(/[^\d]/g, '');

export const DEFAULT_CUSTOM_MEASUREMENTS = {
  height: '',
  bust: '',
  waist: '',
  hips: '',
  shoulder: '',
  sleeve: '',
  length: '',
  armhole: '',
};

const clean = (value) => String(value || '').trim();

const getCurrentPageUrl = () => {
  if (typeof window === 'undefined') return '';
  return window.location.href.split('?')[0];
};

const formatOptionalLine = (label, value) => {
  const safeValue = clean(value);
  return safeValue ? `${label}: ${safeValue}` : '';
};

const buildMeasurementLines = (measurements = {}) => [
  formatOptionalLine('Height', measurements.height),
  formatOptionalLine('Bust / Chest', measurements.bust),
  formatOptionalLine('Waist', measurements.waist),
  formatOptionalLine('Hips', measurements.hips),
  formatOptionalLine('Shoulder', measurements.shoulder),
  formatOptionalLine('Sleeve length', measurements.sleeve),
  formatOptionalLine('Outfit length', measurements.length),
  formatOptionalLine('Armhole', measurements.armhole),
].filter(Boolean);

export function getWhatsAppOrderUrl(message, phone = WHATSAPP_ORDER_NUMBER) {
  const safePhone = String(phone || '').replace(/[^\d]/g, '');
  return `https://wa.me/${safePhone}?text=${encodeURIComponent(message)}`;
}

export function buildCustomizationWhatsAppMessage({
  product,
  size,
  color,
  quantity = 1,
  measurements = {},
  notes = '',
}) {
  const measurementLines = buildMeasurementLines(measurements);
  const isWearableProduct = !['Copperware', 'Walnut Wood', 'Papier Mâché', 'Willow Wicker'].includes(product?.category);

  return [
    isWearableProduct
      ? 'Hello Poshkaar Kashmir, I want to customize this piece.'
      : 'Hello Poshkaar Kashmir, I want to personalize this handcrafted object.',
    '',
    `Product: ${product?.title || 'Selected product'}`,
    product?.id ? `Product ID: ${product.id}` : '',
    product?.price ? `Price: ${formatPrice(product.price)}` : '',
    size ? `Selected size: ${size}` : '',
    color ? `Selected colour: ${color}` : '',
    `Quantity: ${quantity}`,
    getCurrentPageUrl() ? `Product link: ${getCurrentPageUrl()}` : '',
    '',
    ...(isWearableProduct
      ? ['Measurements:', ...(measurementLines.length ? measurementLines : ['I will share my measurements on WhatsApp.'])]
      : []),
    clean(notes) ? '' : '',
    clean(notes) ? `Custom request: ${clean(notes)}` : '',
    '',
    isWearableProduct
      ? 'Please confirm price, fitting, and delivery time.'
      : 'Please confirm the available finish, final price, and delivery time.',
  ].filter((line) => line !== '').join('\n');
}

export function buildCheckoutWhatsAppMessage({
  orderNumber,
  items = [],
  totals = {},
  customer = {},
  giftWrap = false,
  giftMessage = '',
}) {
  const itemLines = items.flatMap((item, index) => [
    `${index + 1}. ${item.title}`,
    item.size ? `   Size: ${item.size}` : '',
    item.color ? `   Colour: ${item.color}` : '',
    `   Qty: ${item.quantity || 1}`,
    `   Price: ${formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1))}`,
  ]).filter(Boolean);

  return [
    'Hello Poshkaar Kashmir, I want to place this order on WhatsApp.',
    '',
    orderNumber ? `Order number: ${orderNumber}` : '',
    '',
    'Customer details:',
    formatOptionalLine('Name', customer.full_name),
    formatOptionalLine('Phone', customer.phone),
    formatOptionalLine('Email', customer.email),
    '',
    'Delivery address:',
    clean(customer.address_line_1),
    clean(customer.address_line_2),
    [customer.city, customer.state, customer.pincode].map(clean).filter(Boolean).join(', '),
    clean(customer.country),
    '',
    'Order items:',
    ...(itemLines.length ? itemLines : ['No items added.']),
    '',
    `Subtotal: ${formatPrice(totals.subtotal || 0)}`,
    `Shipping: ${Number(totals.shipping) ? formatPrice(totals.shipping) : 'Complimentary'}`,
    giftWrap ? `Gift wrapping: ${formatPrice(totals.giftWrapping || 0)}` : '',
    clean(giftMessage) ? `Gift message: ${clean(giftMessage)}` : '',
    `Total: ${formatPrice(totals.total || 0)}`,
    '',
    'Please confirm availability, payment, and delivery time.',
  ].filter((line) => line !== '').join('\n');
}

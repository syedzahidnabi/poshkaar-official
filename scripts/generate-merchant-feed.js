import fs from 'fs';
import path from 'path';
import { LOCAL_PRODUCTS } from '../src/lib/static-products.js';

const SITE_URL = (process.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');
const OUT_FILE = path.join(process.cwd(), 'public', 'merchant-feed.xml');

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteUrl(url) {
  if (!url) return `${SITE_URL}/images/product-placeholder.svg`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function availability(product) {
  const stock = Number(product.stock_quantity ?? product.stock ?? 0);
  return stock > 0 ? 'in_stock' : 'out_of_stock';
}

function shippingPrice(product) {
  return Number(product.price || 0) >= 15000 ? '0.00 INR' : '500.00 INR';
}

function googleCategory(product) {
  const text = `${product.category || ''} ${product.craft || ''}`.toLowerCase();
  if (/(aari|tilla|dabka|zari|pheran|kurta|pashmina|shawl|bridal)/.test(text)) return 'Apparel & Accessories > Clothing';
  if (/(copper|samovar|ewer|dish|bowl)/.test(text)) return 'Home & Garden > Kitchen & Dining';
  if (/(walnut|wood|papier|willow|wicker|basket|box|vase|clock)/.test(text)) return 'Home & Garden > Decor';
  return 'Apparel & Accessories';
}

function isWearable(product) {
  const text = `${product.category || ''} ${product.collection || ''} ${product.craft || ''}`.toLowerCase();
  return /(aari|tilla|dabka|zari|pheran|kurta|pashmina|shawl|bridal|stole|wrap|clothing)/.test(text);
}

function optionalTag(name, value) {
  if (value === null || value === undefined || value === '') return '';
  if (Array.isArray(value) && value.length === 0) return '';
  return `\n      <g:${name}>${escapeXml(Array.isArray(value) ? value.join(', ') : value)}</g:${name}>`;
}

function itemXml(product) {
  const description = product.description || product.short_description || `${product.title} by Poshkaar Kashmir.`;
  const image = product.image || product.images?.[0];
  const extraImages = (product.images || [])
    .filter((item) => item && item !== image)
    .slice(0, 10)
    .map((item) => `\n      <g:additional_image_link>${escapeXml(absoluteUrl(item))}</g:additional_image_link>`)
    .join('');
  const wearable = isWearable(product);

  return `    <item>
      <g:id>${escapeXml(product.sku || product.id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(`${SITE_URL}/product/${product.id}`)}</g:link>
      <g:image_link>${escapeXml(absoluteUrl(image))}</g:image_link>${extraImages}
      <g:availability>${availability(product)}</g:availability>
      <g:price>${Number(product.price || 0).toFixed(2)} INR</g:price>
      <g:brand>Poshkaar Kashmir</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:condition>new</g:condition>
      <g:adult>no</g:adult>${optionalTag('material', product.material || product.fabric)}${optionalTag('color', product.colors?.[0] || product.color)}${wearable ? optionalTag('gender', product.category === 'Bridal' ? 'female' : 'unisex') : ''}${wearable ? optionalTag('age_group', 'adult') : ''}${wearable ? optionalTag('size', product.sizes) : ''}
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard shipping</g:service>
        <g:price>${shippingPrice(product)}</g:price>
      </g:shipping>
      <g:google_product_category>${escapeXml(googleCategory(product))}</g:google_product_category>
      <g:product_type>${escapeXml(product.collection || product.category || product.craft || 'Kashmir craft')}</g:product_type>
      <g:custom_label_0>${escapeXml(product.craft || product.embroidery_type || product.category || 'Kashmir craft')}</g:custom_label_0>
      <g:custom_label_1>${product.ready_to_ship ? 'Ready to ship' : 'Made to order'}</g:custom_label_1>
    </item>`;
}

const activeProducts = LOCAL_PRODUCTS.filter((product) => product?.published !== false && product?.status !== 'inactive');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Poshkaar Kashmir Product Feed</title>
    <link>${SITE_URL}/</link>
    <description>Kashmiri clothing, embroidery, walnut wood, papier mache, copperware and willow wicker by Poshkaar Kashmir.</description>
${activeProducts.map(itemXml).join('\n')}
  </channel>
</rss>
`;

fs.writeFileSync(OUT_FILE, xml, 'utf8');
console.log(`Wrote ${OUT_FILE} with ${activeProducts.length} products`);

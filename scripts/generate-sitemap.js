import fs from 'fs';
import path from 'path';
import { LOCAL_PRODUCTS } from '../src/lib/static-products.js';

const SITE_URL = (process.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');
const OUT_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/collections', priority: '0.9', changefreq: 'daily' },
  { loc: '/collections/new-arrivals', priority: '0.9', changefreq: 'daily' },
  { loc: '/collections/best-sellers', priority: '0.9', changefreq: 'daily' },
  { loc: '/collections/bridal', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/pashmina', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/papier-mache', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/walnut-wood', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/copperware', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/willow-wicker', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/tilla', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/aari', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/dabka', priority: '0.8', changefreq: 'weekly' },
  { loc: '/collections/zari', priority: '0.8', changefreq: 'weekly' },
  { loc: '/our-story', priority: '0.7', changefreq: 'monthly' },
  { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  { loc: '/shop', priority: '0.7', changefreq: 'weekly' },
  { loc: '/journal/slow-handwork', priority: '0.6', changefreq: 'monthly' },
  { loc: '/journal/keepsake-shawl', priority: '0.6', changefreq: 'monthly' },
  { loc: '/journal/kashmir-workshop', priority: '0.6', changefreq: 'monthly' },
  { loc: '/policies/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/policies/terms', priority: '0.3', changefreq: 'yearly' },
  { loc: '/policies/shipping', priority: '0.4', changefreq: 'monthly' },
  { loc: '/policies/returns', priority: '0.4', changefreq: 'monthly' },
  { loc: '/search', priority: '0.5', changefreq: 'weekly' },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function urlEntry({ loc, priority, changefreq, image, imageTitle }) {
  const imageXml = image
    ? `
    <image:image>
      <image:loc>${escapeXml(absoluteUrl(image))}</image:loc>
      <image:title>${escapeXml(imageTitle || '')}</image:title>
    </image:image>`
    : '';

  return `  <url>
    <loc>${escapeXml(absoluteUrl(loc))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;
}

const productRoutes = LOCAL_PRODUCTS.map((product) => ({
  loc: `/product/${product.id}`,
  priority: '0.8',
  changefreq: 'weekly',
  image: product.images?.[0],
  imageTitle: product.title,
}));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticRoutes, ...productRoutes].map(urlEntry).join('\n')}
</urlset>
`;

fs.writeFileSync(OUT_FILE, xml);
console.log(`Wrote ${OUT_FILE}`);

import fs from 'node:fs';
import path from 'node:path';
import { CATALOG_PRODUCTS } from '../src/lib/catalogProducts.js';

const outputPath = path.join(process.cwd(), 'supabase', 'seed-catalog-products.sql');
const catalogStorageBaseUrl = 'https://sqqsrjcmsyctkujlzkmx.supabase.co/storage/v1/object/public/catalog-products';
const storageBackedProductFolders = new Set([
  'copperware',
  'walnut-wood',
  'papier-mache',
  'willow-wicker',
]);

const sqlString = (value) => value == null
  ? 'null'
  : `'${String(value).replaceAll("'", "''")}'`;

const sqlNumber = (value) => Number.isFinite(Number(value))
  ? String(Number(value))
  : 'null';

const sqlBoolean = (value) => value ? 'true' : 'false';
const sqlJson = (value) => `${sqlString(JSON.stringify(value ?? null))}::jsonb`;

const getPublishedImageUrl = (image) => {
  if (typeof image !== 'string') return image;

  const match = image.match(/^\/images\/products\/([^/]+)\/(.+)$/);
  if (!match || !storageBackedProductFolders.has(match[1])) return image;

  return `${catalogStorageBaseUrl}/${match[1]}/${match[2]}`;
};

const rows = CATALOG_PRODUCTS.map((product) => {
  const publishedImages = product.images.map(getPublishedImageUrl);
  const publishedImage = getPublishedImageUrl(product.image);

  return `(
  ${sqlString(product.id)},
  ${sqlString(product.title)},
  ${sqlString(product.slug)},
  ${sqlString(product.sku)},
  ${sqlString(product.category)},
  ${sqlString(product.collection)},
  ${sqlString(product.embroidery_type)},
  ${sqlString(product.description)},
  ${sqlNumber(product.price)},
  ${sqlNumber(product.compare_at_price)},
  ${sqlJson(publishedImages)},
  ${sqlString(publishedImage)},
  ${sqlJson(product.sizes)},
  ${sqlJson(product.colors)},
  ${sqlNumber(product.stock)},
  ${sqlBoolean(product.is_bestseller)},
  0,
  ${sqlString(product.material)},
  ${sqlString(product.origin)},
  ${sqlString(product.craft)},
  ${sqlString(product.care_instructions)},
  ${sqlString(product.lead_time)},
  ${sqlBoolean(product.made_to_order)},
  ${sqlBoolean(product.ready_to_ship)},
  ${sqlBoolean(product.limited_edition)},
  ${sqlBoolean(product.one_of_one)},
  'active',
  true,
  ${sqlString(`${product.title} | Poshkaar Kashmir`)},
  ${sqlString(product.short_description)},
  ${sqlString(product.image_is_studio_preview ? 'pending' : 'approved')}
)`;
}).join(',\n');

const sql = `-- Generated from src/lib/catalogProducts.js.
-- Run supabase/schema.sql and supabase/production-commerce-hardening.sql first.
-- This upsert is idempotent: re-running it updates the same ${CATALOG_PRODUCTS.length} catalogue records.

begin;

insert into public.products (
  id,
  title,
  slug,
  sku,
  category,
  collection,
  embroidery_type,
  description,
  price,
  compare_at_price,
  images,
  image,
  sizes,
  colors,
  stock,
  is_bestseller,
  review_count,
  material,
  origin,
  craft,
  care_instructions,
  lead_time,
  made_to_order,
  ready_to_ship,
  limited_edition,
  one_of_one,
  status,
  published,
  seo_title,
  seo_description,
  photography_status
)
values
${rows}
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  sku = excluded.sku,
  category = excluded.category,
  collection = excluded.collection,
  embroidery_type = excluded.embroidery_type,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  images = excluded.images,
  image = excluded.image,
  sizes = excluded.sizes,
  colors = excluded.colors,
  stock = excluded.stock,
  is_bestseller = excluded.is_bestseller,
  material = excluded.material,
  origin = excluded.origin,
  craft = excluded.craft,
  care_instructions = excluded.care_instructions,
  lead_time = excluded.lead_time,
  made_to_order = excluded.made_to_order,
  ready_to_ship = excluded.ready_to_ship,
  limited_edition = excluded.limited_edition,
  one_of_one = excluded.one_of_one,
  status = excluded.status,
  published = excluded.published,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  photography_status = excluded.photography_status,
  updated_at = now();

notify pgrst, 'reload schema';

commit;

select
  count(*) as total_products,
  count(*) filter (where published and status = 'active') as live_products,
  count(*) filter (where price > 0) as products_with_prices,
  count(*) filter (where jsonb_array_length(images) > 0) as products_with_images
from public.products
where id like 'aari-%'
   or id like 'tilla-%'
   or id like 'dabka-%'
   or id like 'zari-%'
   or id like 'copper-%'
   or id like 'walnut-%'
   or id like 'papier-%'
   or id like 'willow-%';
`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Wrote ${CATALOG_PRODUCTS.length} products to ${outputPath}`);

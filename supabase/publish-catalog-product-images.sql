-- Point the home-object catalogue at the public, production-safe image bucket.
-- Run after `npm run catalog:seed-sql` and the image upload step.

with catalog_image_map (id, object_path) as (
  values
    ('copper-01', 'copperware/copper1-main.jpg'),
    ('copper-02', 'copperware/copper2-main.jpg'),
    ('copper-03', 'copperware/copper3-main.jpg'),
    ('copper-04', 'copperware/copper4-main.jpg'),
    ('copper-05', 'copperware/copper5-main.jpg'),
    ('walnut-01', 'walnut-wood/walnut1-main.jpg'),
    ('walnut-02', 'walnut-wood/walnut2-main.jpg'),
    ('walnut-03', 'walnut-wood/walnut3-main.jpg'),
    ('walnut-04', 'walnut-wood/walnut4-main.jpg'),
    ('walnut-05', 'walnut-wood/walnut5-main.jpg'),
    ('walnut-06', 'walnut-wood/walnut6-main.jpg'),
    ('papier-01', 'papier-mache/papier1-main.jpg'),
    ('papier-02', 'papier-mache/papier2-main.jpg'),
    ('papier-03', 'papier-mache/papier3-main.jpg'),
    ('papier-04', 'papier-mache/papier4-main.jpg'),
    ('papier-05', 'papier-mache/papier5-main.jpg'),
    ('papier-06', 'papier-mache/papier6-main.jpg'),
    ('willow-01', 'willow-wicker/willow1-main.jpg'),
    ('willow-02', 'willow-wicker/willow2-main.jpg'),
    ('willow-03', 'willow-wicker/willow3-main.jpg'),
    ('willow-04', 'willow-wicker/willow4-main.jpg'),
    ('willow-05', 'willow-wicker/willow5-main.jpg')
),
public_images as (
  select
    id,
    'https://sqqsrjcmsyctkujlzkmx.supabase.co/storage/v1/object/public/catalog-products/'
      || object_path as image_url
  from catalog_image_map
)
update public.products as product
set
  image = public_images.image_url,
  images = jsonb_build_array(public_images.image_url),
  updated_at = now()
from public_images
where product.id = public_images.id;

select
  count(*) filter (where image like 'https://%/storage/v1/object/public/catalog-products/%')
    as products_using_public_storage,
  count(*) filter (where id like 'copper-%') as copper_products,
  count(*) filter (where id like 'walnut-%') as walnut_products,
  count(*) filter (where id like 'papier-%') as papier_mache_products,
  count(*) filter (where id like 'willow-%') as willow_products
from public.products
where
  id like 'copper-%'
  or id like 'walnut-%'
  or id like 'papier-%'
  or id like 'willow-%';

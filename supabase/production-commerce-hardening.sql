-- Poshkaar production commerce hardening.
-- Run after supabase/schema.sql in Supabase SQL Editor.
-- This migration makes checkout totals server-owned, normalises order lines and
-- payment records, and reserves stock while Razorpay checkout is in progress.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  hero_image_url text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artisans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  photograph_url text,
  biography text,
  location text,
  craft text,
  years_experience integer check (years_experience is null or years_experience >= 0),
  workshop_information text,
  consent_status text not null default 'pending'
    check (consent_status in ('pending', 'granted', 'withdrawn')),
  verification_notes text,
  payment_terms text,
  lead_time text,
  story_assets jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  whatsapp_number text,
  address jsonb not null default '{}'::jsonb,
  supply_category text,
  minimum_order_quantity integer check (minimum_order_quantity is null or minimum_order_quantity >= 0),
  stock_model text,
  consignment_terms text,
  replacement_terms text,
  quality_score numeric check (quality_score is null or quality_score between 0 and 5),
  reliability_score numeric check (reliability_score is null or reliability_score between 0 and 5),
  payment_history jsonb not null default '[]'::jsonb,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists sku text,
  add column if not exists material text,
  add column if not exists origin text,
  add column if not exists craft text,
  add column if not exists care_instructions text,
  add column if not exists dimensions jsonb not null default '{}'::jsonb,
  add column if not exists weight_grams numeric check (weight_grams is null or weight_grams >= 0),
  add column if not exists tax_rate numeric not null default 0 check (tax_rate between 0 and 100),
  add column if not exists cost_price numeric check (cost_price is null or cost_price >= 0),
  add column if not exists status text not null default 'active',
  add column if not exists published boolean not null default true,
  add column if not exists made_to_order boolean not null default false,
  add column if not exists ready_to_ship boolean not null default true,
  add column if not exists limited_edition boolean not null default false,
  add column if not exists one_of_one boolean not null default false,
  add column if not exists lead_time text,
  add column if not exists low_stock_threshold integer not null default 3 check (low_stock_threshold >= 0),
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists artisan_id uuid references public.artisans(id) on delete set null,
  add column if not exists vendor_id uuid references public.vendors(id) on delete set null,
  add column if not exists category_id uuid references public.categories(id) on delete set null,
  add column if not exists collection_id uuid references public.collections(id) on delete set null,
  add column if not exists authenticity_documentation jsonb not null default '[]'::jsonb,
  add column if not exists quality_control_status text not null default 'pending',
  add column if not exists photography_status text not null default 'pending',
  add column if not exists video_status text not null default 'pending',
  add column if not exists packaging_status text not null default 'pending',
  add column if not exists publishing_approval_status text not null default 'pending';

create unique index if not exists products_sku_unique
  on public.products (lower(sku)) where sku is not null and length(trim(sku)) > 0;
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_collection_id_idx on public.products(collection_id);
create index if not exists products_artisan_id_idx on public.products(artisan_id);
create index if not exists products_vendor_id_idx on public.products(vendor_id);
create index if not exists products_publish_status_idx on public.products(published, status);

-- Existing catalogue rows pre-date the verification fields added above. Keep
-- them private until the team has supplied the minimum trustworthy data.
update public.products
set published = false,
    status = 'draft'
where coalesce(price, 0) <= 0
   or length(trim(coalesce(sku, ''))) = 0
   or length(trim(coalesce(material, ''))) = 0
   or length(trim(coalesce(origin, ''))) = 0
   or (
     length(trim(coalesce(image, ''))) = 0
     and coalesce(jsonb_array_length(images), 0) = 0
   );

create or replace function public.validate_product_publication()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.published or new.status = 'active' then
    if coalesce(new.price, 0) <= 0 then
      raise exception 'A published product needs a price greater than zero.' using errcode = '23514';
    end if;
    if length(trim(coalesce(new.sku, ''))) = 0 then
      raise exception 'A published product needs a SKU.' using errcode = '23514';
    end if;
    if length(trim(coalesce(new.material, ''))) = 0 then
      raise exception 'A published product needs verified material details.' using errcode = '23514';
    end if;
    if length(trim(coalesce(new.origin, ''))) = 0 then
      raise exception 'A published product needs verified origin details.' using errcode = '23514';
    end if;
    if length(trim(coalesce(new.image, ''))) = 0
      and coalesce(jsonb_array_length(new.images), 0) = 0 then
      raise exception 'A published product needs at least one approved image.' using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_product_publication on public.products;
create trigger validate_product_publication
before insert or update on public.products
for each row execute function public.validate_product_publication();

create or replace function public.validate_artisan_publication()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.published and new.consent_status <> 'granted' then
    raise exception 'An artisan profile cannot be published without recorded consent.' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_artisan_publication on public.artisans;
create trigger validate_artisan_publication
before insert or update on public.artisans
for each row execute function public.validate_artisan_publication();

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  media_type text not null default 'image' check (media_type in ('image', 'video', '360')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_sort_idx
  on public.product_images(product_id, sort_order);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  sku text,
  title text not null,
  unit_price numeric not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric not null check (line_total >= 0),
  size text,
  color text,
  image text,
  product_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null,
  provider_order_id text,
  provider_payment_id text,
  amount numeric not null check (amount >= 0),
  currency text not null default 'INR',
  status text not null check (status in ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  raw_details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists payments_provider_order_unique
  on public.payments(provider, provider_order_id)
  where provider_order_id is not null;
create unique index if not exists payments_provider_payment_unique
  on public.payments(provider, provider_payment_id)
  where provider_payment_id is not null;
create index if not exists payments_order_id_idx on public.payments(order_id);

create table if not exists public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  status text not null default 'active' check (status in ('active', 'consumed', 'released')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique(order_id, product_id)
);

create index if not exists inventory_reservations_active_idx
  on public.inventory_reservations(product_id, expires_at)
  where status = 'active';

alter table public.products alter column published set default false;
alter table public.products alter column status set default 'draft';

alter table public.orders
  add column if not exists tax numeric not null default 0 check (tax >= 0),
  add column if not exists shipping_partner text,
  add column if not exists tracking_url text,
  add column if not exists invoice_url text,
  add column if not exists refund_status text,
  add column if not exists cancellation_status text,
  add column if not exists cancelled_at timestamptz,
  add column if not exists refunded_at timestamptz;

create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0 and quantity <= 25),
  size text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cart_id, product_id, size, color)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  verified_purchase boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id, order_item_id)
);

create index if not exists reviews_product_status_idx on public.reviews(product_id, status, created_at desc);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric not null check (discount_value > 0),
  minimum_order numeric not null default 0 check (minimum_order >= 0),
  maximum_discount numeric check (maximum_discount is null or maximum_discount >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists coupons_code_unique on public.coupons(lower(code));

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  channel text not null check (channel in ('email', 'whatsapp', 'sms', 'in_app')),
  recipient text,
  template_key text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'skipped')),
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_order_idx on public.notifications(order_id, created_at desc);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body jsonb not null default '[]'::jsonb,
  hero_image_url text,
  author_name text,
  category text,
  related_product_ids jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journal_posts_status_date_idx on public.journal_posts(status, published_at desc);

create table if not exists public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  quantity_change integer not null,
  reason text not null,
  reference_type text,
  reference_id text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists inventory_adjustments_product_idx on public.inventory_adjustments(product_id, created_at desc);

create table if not exists public.product_intake (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.products(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete set null,
  artisan_id uuid references public.artisans(id) on delete set null,
  proposed_sku text,
  cost_price numeric check (cost_price is null or cost_price >= 0),
  selling_price numeric check (selling_price is null or selling_price >= 0),
  dimensions jsonb not null default '{}'::jsonb,
  weight_grams numeric check (weight_grams is null or weight_grams >= 0),
  quantity integer check (quantity is null or quantity >= 0),
  authenticity_documentation jsonb not null default '[]'::jsonb,
  photography_status text not null default 'pending',
  video_status text not null default 'pending',
  quality_control_status text not null default 'pending',
  packaging_status text not null default 'pending',
  publishing_approval_status text not null default 'pending',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep operational timestamps reliable without depending on the browser.
drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();
drop trigger if exists set_collections_updated_at on public.collections;
create trigger set_collections_updated_at before update on public.collections
for each row execute function public.set_updated_at();
drop trigger if exists set_artisans_updated_at on public.artisans;
create trigger set_artisans_updated_at before update on public.artisans
for each row execute function public.set_updated_at();
drop trigger if exists set_vendors_updated_at on public.vendors;
create trigger set_vendors_updated_at before update on public.vendors
for each row execute function public.set_updated_at();
drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at before update on public.payments
for each row execute function public.set_updated_at();
drop trigger if exists set_customer_profiles_updated_at on public.customer_profiles;
create trigger set_customer_profiles_updated_at before update on public.customer_profiles
for each row execute function public.set_updated_at();
drop trigger if exists set_carts_updated_at on public.carts;
create trigger set_carts_updated_at before update on public.carts
for each row execute function public.set_updated_at();
drop trigger if exists set_cart_items_updated_at on public.cart_items;
create trigger set_cart_items_updated_at before update on public.cart_items
for each row execute function public.set_updated_at();
drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at before update on public.reviews
for each row execute function public.set_updated_at();
drop trigger if exists set_coupons_updated_at on public.coupons;
create trigger set_coupons_updated_at before update on public.coupons
for each row execute function public.set_updated_at();
drop trigger if exists set_journal_posts_updated_at on public.journal_posts;
create trigger set_journal_posts_updated_at before update on public.journal_posts
for each row execute function public.set_updated_at();
drop trigger if exists set_product_intake_updated_at on public.product_intake;
create trigger set_product_intake_updated_at before update on public.product_intake
for each row execute function public.set_updated_at();

create or replace function public.create_checkout_order(
  p_order jsonb,
  p_checkout_session text
)
returns public.orders
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.orders;
  v_product public.products%rowtype;
  v_item jsonb;
  v_lines jsonb := '[]'::jsonb;
  v_product_id text;
  v_quantity integer;
  v_reserved integer;
  v_current_order_quantity integer;
  v_subtotal numeric := 0;
  v_shipping numeric := 0;
  v_gift_wrapping boolean := false;
  v_gift_cost numeric := 0;
  v_total numeric := 0;
  v_email text;
  v_payment_method text;
begin
  if length(trim(coalesce(p_checkout_session, ''))) < 24 then
    raise exception 'A valid checkout session is required.' using errcode = '22023';
  end if;

  v_email := lower(trim(coalesce(p_order ->> 'customer_email', '')));
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then
    raise exception 'A valid customer email is required.' using errcode = '22023';
  end if;

  if coalesce(jsonb_typeof(p_order -> 'items'), '') <> 'array' then
    raise exception 'The order must contain a product list.' using errcode = '22023';
  end if;

  if jsonb_array_length(p_order -> 'items') = 0 then
    raise exception 'The order must contain at least one product.' using errcode = '22023';
  end if;

  if length(trim(coalesce(p_order ->> 'customer_name', ''))) < 2 then
    raise exception 'A customer name is required.' using errcode = '22023';
  end if;

  if length(regexp_replace(coalesce(p_order ->> 'customer_phone', ''), '[^0-9]', '', 'g')) < 8 then
    raise exception 'A valid customer phone number is required.' using errcode = '22023';
  end if;

  if length(trim(coalesce(p_order -> 'shipping_address' ->> 'address_line_1', ''))) < 4
    or length(trim(coalesce(p_order -> 'shipping_address' ->> 'city', ''))) < 2
    or length(trim(coalesce(p_order -> 'shipping_address' ->> 'country', ''))) < 2 then
    raise exception 'A complete shipping address is required.' using errcode = '22023';
  end if;

  if jsonb_array_length(p_order -> 'items') > 40 then
    raise exception 'The order contains too many line items.' using errcode = '22023';
  end if;

  for v_item in select value from jsonb_array_elements(p_order -> 'items')
  loop
    v_product_id := trim(coalesce(v_item ->> 'product_id', ''));
    v_quantity := greatest(1, least(25, coalesce((v_item ->> 'quantity')::integer, 1)));

    select * into v_product
      from public.products
      where id = v_product_id
        and published = true
        and status = 'active'
      for update;

    if not found then
      raise exception 'A product in your bag is no longer available.' using errcode = 'P0002';
    end if;

    if coalesce(v_product.price, 0) <= 0 then
      raise exception 'A product has an invalid catalogue price.' using errcode = '22023';
    end if;

    select coalesce(sum(quantity), 0)::integer into v_reserved
      from public.inventory_reservations
      where product_id = v_product.id
        and status = 'active'
        and expires_at > now();

    select coalesce(sum((line ->> 'quantity')::integer), 0)::integer into v_current_order_quantity
      from jsonb_array_elements(v_lines) as line
      where line ->> 'product_id' = v_product.id;

    if not v_product.made_to_order
      and (coalesce(v_product.stock, 0) - v_reserved - v_current_order_quantity) < v_quantity then
      raise exception '% does not have enough stock for this order.', v_product.title using errcode = 'P0001';
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'sku', v_product.sku,
      'title', v_product.title,
      'unit_price', v_product.price,
      'price', v_product.price,
      'quantity', v_quantity,
      'line_total', v_product.price * v_quantity,
      'size', nullif(trim(coalesce(v_item ->> 'size', '')), ''),
      'color', nullif(trim(coalesce(v_item ->> 'color', '')), ''),
      'image', coalesce(nullif(v_product.image, ''), v_product.images ->> 0, ''),
      'product_snapshot', jsonb_build_object(
        'sku', v_product.sku,
        'title', v_product.title,
        'category', v_product.category,
        'material', v_product.material,
        'origin', v_product.origin,
        'made_to_order', v_product.made_to_order,
        'lead_time', v_product.lead_time
      )
    ));
  end loop;

  v_gift_wrapping := coalesce((p_order ->> 'gift_wrapping')::boolean, false);
  v_shipping := case when v_subtotal >= 15000 then 0 else 500 end;
  v_gift_cost := case when v_gift_wrapping then 299 else 0 end;
  v_total := v_subtotal + v_shipping + v_gift_cost;
  v_payment_method := lower(trim(coalesce(p_order ->> 'payment_method', 'razorpay')));

  if v_payment_method not in ('razorpay', 'manual_upi', 'whatsapp_order', 'cod') then
    raise exception 'This payment method is not supported.' using errcode = '22023';
  end if;

  insert into public.orders (
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    status,
    items,
    subtotal,
    shipping,
    discount,
    total,
    coupon_code,
    shipping_address,
    payment_method,
    payment_status,
    payment_details,
    gift_wrapping,
    gift_message,
    created_by
  ) values (
    'PK' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    left(trim(coalesce(p_order ->> 'customer_name', '')), 160),
    v_email,
    left(trim(coalesce(p_order ->> 'customer_phone', '')), 32),
    'pending',
    v_lines,
    v_subtotal,
    v_shipping,
    0,
    v_total,
    null,
    coalesce(p_order -> 'shipping_address', '{}'::jsonb),
    v_payment_method,
    'pending',
    coalesce(p_order -> 'payment_details', '{}'::jsonb),
    v_gift_wrapping,
    left(coalesce(p_order ->> 'gift_message', ''), 500),
    trim(p_checkout_session)
  ) returning * into v_order;

  insert into public.order_items (
    order_id, product_id, sku, title, unit_price, quantity, line_total,
    size, color, image, product_snapshot
  )
  select
    v_order.id,
    line.product_id,
    line.sku,
    line.title,
    line.unit_price,
    line.quantity,
    line.line_total,
    line.size,
    line.color,
    line.image,
    line.product_snapshot
  from jsonb_to_recordset(v_lines) as line(
    product_id text,
    sku text,
    title text,
    unit_price numeric,
    quantity integer,
    line_total numeric,
    size text,
    color text,
    image text,
    product_snapshot jsonb
  );

  insert into public.inventory_reservations(order_id, product_id, quantity, expires_at)
  select v_order.id, line.product_id, sum(line.quantity)::integer, now() + interval '20 minutes'
  from jsonb_to_recordset(v_lines) as line(product_id text, quantity integer)
  group by line.product_id;

  return v_order;
end;
$$;

create or replace function public.confirm_razorpay_payment(
  p_order_id uuid,
  p_provider_order_id text,
  p_provider_payment_id text,
  p_amount numeric,
  p_details jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.orders;
  v_line public.order_items%rowtype;
  v_existing_payment public.payments%rowtype;
  v_reserved integer;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Order not found.' using errcode = 'P0002';
  end if;

  select * into v_existing_payment
    from public.payments
    where provider = 'razorpay' and provider_payment_id = p_provider_payment_id;

  if found then
    if v_existing_payment.order_id <> p_order_id then
      raise exception 'Payment is already assigned to another order.' using errcode = '23505';
    end if;
    return jsonb_build_object(
      'success', true,
      'idempotent', true,
      'orderId', v_order.id,
      'orderNumber', v_order.order_number,
      'paymentStatus', v_order.payment_status,
      'status', v_order.status
    );
  end if;

  if round(coalesce(p_amount, -1), 2) <> round(v_order.total, 2) then
    raise exception 'Payment amount does not match the server order total.' using errcode = '22023';
  end if;

  if length(trim(coalesce(p_provider_order_id, ''))) = 0
    or length(trim(coalesce(p_provider_payment_id, ''))) = 0 then
    raise exception 'Razorpay order and payment ids are required.' using errcode = '22023';
  end if;

  if coalesce(v_order.payment_details ->> 'razorpay_order_id', '') <> p_provider_order_id then
    raise exception 'Razorpay order id does not match the saved checkout.' using errcode = '22023';
  end if;

  for v_line in select * from public.order_items where order_id = v_order.id order by product_id
  loop
    perform 1 from public.products where id = v_line.product_id for update;

    select coalesce(sum(quantity), 0)::integer into v_reserved
      from public.inventory_reservations
      where product_id = v_line.product_id
        and order_id <> v_order.id
        and status = 'active'
        and expires_at > now();

    update public.products
      set stock = case when made_to_order then stock else stock - v_line.quantity end
      where id = v_line.product_id
        and (
          made_to_order
          or (stock - v_reserved) >= v_line.quantity
        );

    if not found then
      raise exception 'Stock changed before payment could be confirmed. Contact support with your payment id.' using errcode = 'P0001';
    end if;
  end loop;

  insert into public.payments (
    order_id, provider, provider_order_id, provider_payment_id,
    amount, currency, status, raw_details
  ) values (
    v_order.id, 'razorpay', p_provider_order_id, p_provider_payment_id,
    p_amount, 'INR', 'paid', coalesce(p_details, '{}'::jsonb)
  );

  update public.inventory_reservations
    set status = 'consumed'
    where order_id = v_order.id and status = 'active';

  update public.orders
    set payment_method = 'razorpay',
        payment_status = 'paid',
        status = 'confirmed',
        payment_id = p_provider_payment_id,
        payment_details = coalesce(payment_details, '{}'::jsonb) || coalesce(p_details, '{}'::jsonb)
    where id = v_order.id
    returning * into v_order;

  return jsonb_build_object(
    'success', true,
    'idempotent', false,
    'orderId', v_order.id,
    'orderNumber', v_order.order_number,
    'paymentStatus', v_order.payment_status,
    'status', v_order.status
  );
end;
$$;

alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.artisans enable row level security;
alter table public.vendors enable row level security;
alter table public.product_images enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.notifications enable row level security;
alter table public.journal_posts enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.product_intake enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select
to anon, authenticated
using ((published and status = 'active') or public.is_admin());

drop policy if exists "Public can read published categories" on public.categories;
create policy "Public can read published categories" on public.categories for select
to anon, authenticated using (published or public.is_admin());

drop policy if exists "Public can read published collections" on public.collections;
create policy "Public can read published collections" on public.collections for select
to anon, authenticated using (published or public.is_admin());

drop policy if exists "Public can read published artisans" on public.artisans;
create policy "Public can read published artisans" on public.artisans for select
to anon, authenticated using ((published and consent_status = 'granted') or public.is_admin());

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images" on public.product_images for select
to anon, authenticated using (
  public.is_admin()
  or exists (
    select 1 from public.products p
    where p.id = product_id and p.published and p.status = 'active'
  )
);

drop policy if exists "Public can read published reviews" on public.reviews;
create policy "Public can read published reviews" on public.reviews for select
to anon, authenticated using (status = 'published' or public.is_admin() or user_id = auth.uid());

drop policy if exists "Customers can submit their reviews" on public.reviews;
create policy "Customers can submit their reviews" on public.reviews for insert
to authenticated with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where oi.id = order_item_id
      and oi.product_id = product_id
      and lower(o.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and o.payment_status = 'paid'
  )
);

drop policy if exists "Public can read published journal posts" on public.journal_posts;
create policy "Public can read published journal posts" on public.journal_posts for select
to anon, authenticated using (status = 'published' or public.is_admin());

drop policy if exists "Customers manage their profile" on public.customer_profiles;
create policy "Customers manage their profile" on public.customer_profiles for all
to authenticated using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Customers manage their cart" on public.carts;
create policy "Customers manage their cart" on public.carts for all
to authenticated using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Customers manage their cart items" on public.cart_items;
create policy "Customers manage their cart items" on public.cart_items for all
to authenticated using (
  public.is_admin() or exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
)
with check (
  public.is_admin() or exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
);

drop policy if exists "Customers read their notifications" on public.notifications;
create policy "Customers read their notifications" on public.notifications for select
to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage collections" on public.collections;
create policy "Admins manage collections" on public.collections for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage artisans" on public.artisans;
create policy "Admins manage artisans" on public.artisans for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage vendors" on public.vendors;
create policy "Admins manage vendors" on public.vendors for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage product images" on public.product_images;
create policy "Admins manage product images" on public.product_images for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews" on public.reviews for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage coupons" on public.coupons;
create policy "Admins manage coupons" on public.coupons for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications" on public.notifications for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage journal posts" on public.journal_posts;
create policy "Admins manage journal posts" on public.journal_posts for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage inventory adjustments" on public.inventory_adjustments;
create policy "Admins manage inventory adjustments" on public.inventory_adjustments for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage product intake" on public.product_intake;
create policy "Admins manage product intake" on public.product_intake for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Customers and admins can read order items" on public.order_items;
create policy "Customers and admins can read order items" on public.order_items for select
to anon, authenticated using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (
        public.is_admin()
        or lower(o.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        or (length(public.checkout_session_token()) >= 24 and o.created_by = public.checkout_session_token())
      )
  )
);

drop policy if exists "Customers and admins can read payments" on public.payments;
create policy "Customers and admins can read payments" on public.payments for select
to anon, authenticated using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (
        public.is_admin()
        or lower(o.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        or (length(public.checkout_session_token()) >= 24 and o.created_by = public.checkout_session_token())
      )
  )
);

drop policy if exists "Anyone can create checkout orders" on public.orders;
revoke insert on public.orders from anon, authenticated;
revoke insert, update, delete on public.order_items from anon, authenticated;
revoke insert, update, delete on public.payments from anon, authenticated;
revoke all on public.inventory_reservations from anon, authenticated;
revoke all on public.vendors from anon, authenticated;

grant select on public.categories, public.collections, public.artisans, public.product_images to anon, authenticated;
grant select on public.order_items, public.payments to anon, authenticated;
grant select on public.reviews, public.journal_posts to anon, authenticated;
grant select, insert, update, delete on public.categories, public.collections, public.artisans,
  public.vendors, public.product_images, public.customer_profiles, public.carts, public.cart_items,
  public.reviews, public.coupons, public.notifications, public.journal_posts,
  public.inventory_adjustments, public.product_intake to authenticated;

revoke all on function public.create_checkout_order(jsonb, text) from public, anon, authenticated;
revoke all on function public.confirm_razorpay_payment(uuid, text, text, numeric, jsonb) from public, anon, authenticated;
grant execute on function public.create_checkout_order(jsonb, text) to service_role;
grant execute on function public.confirm_razorpay_payment(uuid, text, text, numeric, jsonb) to service_role;

notify pgrst, 'reload schema';

-- Poshkaar Kashmir free-tier Supabase backend.
-- Run this once in Supabase SQL Editor.
-- Then set VITE_BACKEND_PROVIDER=supabase, VITE_SUPABASE_URL, and VITE_SUPABASE_PUBLISHABLE_KEY.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email)
values ('poshkaarkashmirofficial@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.checkout_session_token()
returns text
language plpgsql
stable
as $$
declare
  request_headers jsonb;
begin
  begin
    request_headers := current_setting('request.headers', true)::jsonb;
  exception when others then
    return '';
  end;

  return coalesce(request_headers ->> 'x-checkout-session', '');
end;
$$;

create table if not exists public.products (
  id text primary key,
  title text not null,
  slug text,
  category text,
  collection text,
  embroidery_type text,
  description text,
  price numeric not null default 0,
  compare_at_price numeric,
  images jsonb not null default '[]'::jsonb,
  image text,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  is_bestseller boolean not null default false,
  review_count integer not null default 0,
  created_date timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text,
  customer_email text not null,
  customer_phone text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  coupon_code text,
  shipping_address jsonb not null default '{}'::jsonb,
  payment_method text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_id text,
  payment_details jsonb,
  gift_wrapping boolean not null default false,
  gift_message text,
  notes text,
  tracking_number text,
  estimated_delivery text,
  confirmation_email_sent_at timestamptz,
  admin_notification_sent_at timestamptz,
  whatsapp_notification_sent_at timestamptz,
  owner_whatsapp_notification_sent_at timestamptz,
  customer_whatsapp_notification_sent_at timestamptz,
  created_by text default (auth.jwt() ->> 'email'),
  created_date timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
add column if not exists whatsapp_notification_sent_at timestamptz,
add column if not exists owner_whatsapp_notification_sent_at timestamptz,
add column if not exists customer_whatsapp_notification_sent_at timestamptz;

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid(),
  created_by text default (auth.jwt() ->> 'email'),
  full_name text,
  phone text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  pincode text,
  country text default 'India',
  created_date timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid(),
  created_by text default (auth.jwt() ->> 'email'),
  product_id text not null,
  title text,
  price numeric,
  image text,
  created_date timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_date timestamptz not null default now()
);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

drop trigger if exists set_wishlist_items_updated_at on public.wishlist_items;
create trigger set_wishlist_items_updated_at
before update on public.wishlist_items
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.newsletter_signups enable row level security;

drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list"
on public.admin_users for select
to authenticated
using (public.is_admin() or lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can create checkout orders" on public.orders;
create policy "Anyone can create checkout orders"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Customers and admins can read orders" on public.orders;
create policy "Customers and admins can read orders"
on public.orders for select
to anon, authenticated
using (
  public.is_admin()
  or lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or lower(coalesce(created_by, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or (
    length(public.checkout_session_token()) >= 24
    and coalesce(created_by, '') = public.checkout_session_token()
  )
);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
on public.orders for delete
to authenticated
using (public.is_admin());

drop policy if exists "Users can read their addresses" on public.addresses;
create policy "Users can read their addresses"
on public.addresses for select
to authenticated
using (public.is_admin() or user_id = auth.uid() or lower(created_by) = lower(auth.jwt() ->> 'email'));

drop policy if exists "Users can manage their addresses" on public.addresses;
create policy "Users can manage their addresses"
on public.addresses for all
to authenticated
using (public.is_admin() or user_id = auth.uid())
with check (public.is_admin() or user_id = auth.uid());

drop policy if exists "Users can read their wishlist" on public.wishlist_items;
create policy "Users can read their wishlist"
on public.wishlist_items for select
to authenticated
using (public.is_admin() or user_id = auth.uid() or lower(created_by) = lower(auth.jwt() ->> 'email'));

drop policy if exists "Users can manage their wishlist" on public.wishlist_items;
create policy "Users can manage their wishlist"
on public.wishlist_items for all
to authenticated
using (public.is_admin() or user_id = auth.uid())
with check (public.is_admin() or user_id = auth.uid());

drop policy if exists "Anyone can subscribe to newsletter" on public.newsletter_signups;
create policy "Anyone can subscribe to newsletter"
on public.newsletter_signups for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read newsletter signups" on public.newsletter_signups;
create policy "Admins can read newsletter signups"
on public.newsletter_signups for select
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.products to anon, authenticated;
grant select, insert, update, delete on public.orders to anon, authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, update, delete on public.wishlist_items to authenticated;
grant select, insert on public.newsletter_signups to anon, authenticated;
grant select on public.admin_users to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.checkout_session_token() to anon, authenticated;

-- Refresh Supabase/PostgREST so new tables are visible to the API immediately.
notify pgrst, 'reload schema';

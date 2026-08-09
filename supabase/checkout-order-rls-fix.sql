-- Run this after supabase/schema.sql if guest checkout says:
-- "new row violates row-level security policy for table \"orders\""
--
-- It lets a guest checkout read only the order it just created by matching
-- a private x-checkout-session request header. It does not make all orders public.

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

alter table public.orders enable row level security;

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

grant usage on schema public to anon, authenticated;
grant select, insert on public.orders to anon, authenticated;
grant execute on function public.checkout_session_token() to anon, authenticated;

notify pgrst, 'reload schema';

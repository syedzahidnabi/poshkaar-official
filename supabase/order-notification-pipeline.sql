-- Production order notification pipeline upgrade.
-- Run this in Supabase SQL Editor after supabase/schema.sql.
--
-- Adds timestamps for WhatsApp notification tracking.

alter table public.orders
add column if not exists whatsapp_notification_sent_at timestamptz,
add column if not exists owner_whatsapp_notification_sent_at timestamptz,
add column if not exists customer_whatsapp_notification_sent_at timestamptz;

notify pgrst, 'reload schema';

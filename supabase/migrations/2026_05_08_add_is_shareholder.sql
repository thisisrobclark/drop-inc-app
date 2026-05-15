-- ============================================================
-- Add is_shareholder flag to profiles.
-- Run this in your Supabase SQL Editor against the existing
-- production database (the schema.sql is for fresh installs only).
-- ============================================================

alter table public.profiles
  add column if not exists is_shareholder boolean not null default false;

-- After running, flip the flag for any existing CropShield shareholders, e.g.:
--   update public.profiles set is_shareholder = true
--   where email in ('shareholder1@example.com', 'shareholder2@example.com');

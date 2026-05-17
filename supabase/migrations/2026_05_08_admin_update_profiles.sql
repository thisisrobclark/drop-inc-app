-- ============================================================
-- Allow admins to update any profile (needed for the Customers
-- admin UI that toggles is_shareholder / is_admin per user).
-- Without this, only the user themselves could change their flags.
-- Run this in your Supabase SQL Editor.
-- ============================================================

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

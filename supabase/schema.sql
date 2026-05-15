-- ============================================================
-- Drop Inc - Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── Helper function: check if current user is admin ──
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- ══════════════════════════════════════════════════════
-- PROFILES (extends auth.users)
-- ══════════════════════════════════════════════════════
create table public.profiles (
  id            uuid references auth.users on delete cascade primary key,
  email         text,
  full_name     text default '',
  farm_name     text default '',
  phone         text default '',
  physical_address  text default '',
  mailing_address   text default '',
  delivery_directions text default '',
  is_admin      boolean default false,
  is_shareholder boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ══════════════════════════════════════════════════════
-- ORDERS
-- ══════════════════════════════════════════════════════
create table public.orders (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  status      text default 'received'
              check (status in ('received','invoiced','paid','ordered','arrived','delivered')),
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can update all orders"
  on public.orders for update
  using (public.is_admin());

-- ══════════════════════════════════════════════════════
-- ORDER ITEMS
-- ══════════════════════════════════════════════════════
create table public.order_items (
  id                uuid default uuid_generate_v4() primary key,
  order_id          uuid references public.orders(id) on delete cascade not null,
  product_id        text not null,
  product_name      text not null,
  product_category  text not null,
  quantity          integer not null check (quantity > 0),
  unit              text default 'unit',
  created_at        timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_items.order_id and user_id = auth.uid()
    )
  );

create policy "Users can insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_items.order_id and user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin());

-- ══════════════════════════════════════════════════════
-- ORDER TRACKING (6-step status with dates & notes)
-- ══════════════════════════════════════════════════════
create table public.order_tracking (
  id            uuid default uuid_generate_v4() primary key,
  order_id      uuid references public.orders(id) on delete cascade not null,
  step_name     text not null
                check (step_name in ('received','invoiced','paid','ordered','arrived','delivered')),
  completed     boolean default false,
  completed_at  timestamptz,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique(order_id, step_name)
);

alter table public.order_tracking enable row level security;

create policy "Users can view own tracking"
  on public.order_tracking for select
  using (
    exists (
      select 1 from public.orders
      where id = order_tracking.order_id and user_id = auth.uid()
    )
  );

create policy "Admins can view all tracking"
  on public.order_tracking for select
  using (public.is_admin());

create policy "Admins can update tracking"
  on public.order_tracking for update
  using (public.is_admin());

create policy "Admins can insert tracking"
  on public.order_tracking for insert
  with check (public.is_admin());

-- ══════════════════════════════════════════════════════
-- TRIGGERS
-- ══════════════════════════════════════════════════════

-- Auto-create 6 tracking steps when a new order is inserted
create or replace function public.create_order_tracking()
returns trigger as $$
begin
  insert into public.order_tracking (order_id, step_name, completed, completed_at)
  values
    (NEW.id, 'received',  true,  now()),
    (NEW.id, 'invoiced',  false, null),
    (NEW.id, 'paid',      false, null),
    (NEW.id, 'ordered',   false, null),
    (NEW.id, 'arrived',   false, null),
    (NEW.id, 'delivered', false, null);
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_order_created
  after insert on public.orders
  for each row execute function public.create_order_tracking();

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (NEW.id, NEW.email);
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ══════════════════════════════════════════════════════
-- MAKE YOUR FIRST ADMIN
-- Run this after creating your account, replacing the email:
-- ══════════════════════════════════════════════════════
-- update public.profiles set is_admin = true
-- where email = 'your-admin@example.com';

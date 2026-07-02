-- ============================================================
-- LUVORA — Supabase schema (Postgres)
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- Prices are stored in whole Colombian pesos (integer, no decimals).
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Enums ──────────────────────────────────────────────────
create type category_slug as enum
  ('juguetes','lenceria','lubricantes','bienestar','accesorios','kits');

create type order_status as enum
  ('pendiente','pagado','preparando','enviado','entregado','cancelado');

create type user_role as enum ('customer','admin');

-- ── Helper: updated_at trigger ─────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ── Profiles (1:1 with auth.users) ─────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile when a user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ── Categories ─────────────────────────────────────────────
create table categories (
  slug        category_slug primary key,
  name        text not null,
  description text,
  image       text,
  sort        int not null default 0
);

-- ── Products ───────────────────────────────────────────────
create table products (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  category         category_slug not null references categories(slug),
  subtitle         text,
  description      text not null default '',
  price            int  not null check (price >= 0),   -- COP
  compare_at_price int  check (compare_at_price >= 0),
  materials        text,
  shipping         text,
  badges           text[] not null default '{}',
  rating           numeric(2,1) default 0,
  review_count     int not null default 0,
  stock            int not null default 0,
  featured         boolean not null default false,
  best_seller      boolean not null default false,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index products_category_idx on products(category) where active;
create index products_slug_idx on products(slug);
create trigger products_updated before update on products
  for each row execute function set_updated_at();

-- ── Product images & variants ──────────────────────────────
create table product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url        text not null,
  alt        text,
  position   int not null default 0
);
create index product_images_product_idx on product_images(product_id);

create table product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label      text not null,          -- "Burdeos", "Talla M"
  swatch     text,                   -- hex for color swatches
  price      int check (price >= 0), -- overrides product.price when set
  stock      int not null default 0
);
create index product_variants_product_idx on product_variants(product_id);

-- ── Wishlists ──────────────────────────────────────────────
create table wishlists (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ── Orders ─────────────────────────────────────────────────
create table orders (
  id             uuid primary key default gen_random_uuid(),
  number         text unique not null,
  user_id        uuid references auth.users(id) on delete set null,
  status         order_status not null default 'pendiente',
  email          text not null,
  subtotal       int not null,
  shipping       int not null default 0,
  total          int not null,
  -- Shipping address (denormalized snapshot)
  full_name      text not null,
  phone          text not null,
  department     text not null,
  city           text not null,
  address_line   text not null,
  notes          text,
  payment_id     text,               -- Mercado Pago payment id
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index orders_user_idx on orders(user_id);
create trigger orders_updated before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  name          text not null,       -- snapshot at purchase time
  variant_label text,
  quantity      int not null check (quantity > 0),
  unit_price    int not null
);
create index order_items_order_idx on order_items(order_id);

-- ── Newsletter subscribers ─────────────────────────────────
create table subscribers (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles         enable row level security;
alter table categories       enable row level security;
alter table products         enable row level security;
alter table product_images   enable row level security;
alter table product_variants enable row level security;
alter table wishlists        enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table subscribers      enable row level security;

-- Public catalog is world-readable (only active products).
create policy "catalog: public read" on categories       for select using (true);
create policy "products: public read" on products         for select using (active or is_admin());
create policy "images: public read" on product_images     for select using (true);
create policy "variants: public read" on product_variants for select using (true);

-- Admins manage the catalog.
create policy "products: admin write" on products         for all using (is_admin()) with check (is_admin());
create policy "images: admin write" on product_images     for all using (is_admin()) with check (is_admin());
create policy "variants: admin write" on product_variants for all using (is_admin()) with check (is_admin());
create policy "categories: admin write" on categories     for all using (is_admin()) with check (is_admin());

-- Profiles: users read/update their own; admins read all.
create policy "profiles: self read"   on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles: self update" on profiles for update using (id = auth.uid());

-- Wishlists: private to the user.
create policy "wishlist: owner" on wishlists for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Orders: users see their own; admins see all. Inserts are typically done
-- server-side (service role) after payment; adjust if you allow client inserts.
create policy "orders: owner read" on orders for select
  using (user_id = auth.uid() or is_admin());
create policy "orders: admin write" on orders for all
  using (is_admin()) with check (is_admin());
create policy "order_items: owner read" on order_items for select
  using (
    exists (select 1 from orders o where o.id = order_id
            and (o.user_id = auth.uid() or is_admin()))
  );

-- Subscribers: anyone may subscribe; only admins read.
create policy "subscribers: insert" on subscribers for insert with check (true);
create policy "subscribers: admin read" on subscribers for select using (is_admin());

-- ── Seed categories ────────────────────────────────────────
insert into categories (slug, name, sort) values
  ('juguetes','Juguetes',1),
  ('lenceria','Lencería',2),
  ('lubricantes','Lubricantes',3),
  ('bienestar','Bienestar',4),
  ('accesorios','Accesorios',5),
  ('kits','Kits y regalos',6)
on conflict (slug) do nothing;

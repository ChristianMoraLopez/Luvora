-- =====================================================================
-- LUVORA · Users, carts, orders & reviews  (migration 3)
-- Requires: schema.sql (catalog) already applied.
--
-- Design notes
--  * `profiles` is 1:1 with auth.users and is auto-created by trigger.
--  * `orders` + `order_items` snapshot name/price/sku at purchase time,
--    so history stays correct even if the catalog changes.
--  * Money in COP (integer, no decimals) — same convention as catalog.
--  * RLS: each user only sees/edits their own rows. Writes that require
--    trust (changing order status, stock) are service-role only.
-- =====================================================================

-- ---------------------------------------------------------------------
-- PROFILES  (1:1 auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  phone         text,
  birth_date    date,                          -- for +18 verification
  avatar_url    text,
  marketing_opt_in boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;

do $$
begin
  begin
    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  exception when others then
    raise notice 'auth trigger skipped: %', sqlerrm;
  end;
end $$;

-- ---------------------------------------------------------------------
-- ADDRESSES  (shipping; Colombia-first fields)
-- ---------------------------------------------------------------------
create table if not exists public.addresses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  label         text not null default 'Casa',      -- Casa / Oficina / ...
  recipient     text not null,
  phone         text not null,
  address_line1 text not null,
  address_line2 text,
  city          text not null,
  department    text not null,                      -- departamento (CO)
  postal_code   text,
  country       text not null default 'CO',
  delivery_notes text,                              -- "empaque discreto", portería...
  is_default    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_addresses_user on public.addresses(user_id);

-- only one default address per user
create unique index if not exists uq_addresses_default
  on public.addresses(user_id) where is_default;

-- ---------------------------------------------------------------------
-- CARTS  (one active cart per user; guests use localStorage client-side)
-- ---------------------------------------------------------------------
create table if not exists public.carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  quantity   int  not null default 1 check (quantity > 0),
  added_at   timestamptz not null default now(),
  unique (cart_id, variant_id)
);
create index if not exists idx_cart_items_cart on public.cart_items(cart_id);

-- ---------------------------------------------------------------------
-- ORDERS  (historical de compras)
-- ---------------------------------------------------------------------
create sequence if not exists public.order_number_seq;

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique
                 default 'LUV-' || lpad(nextval('public.order_number_seq')::text, 6, '0'),
  user_id        uuid references public.profiles(id) on delete set null,
  guest_email    text,                              -- for guest checkout (service role)
  status         text not null default 'pendiente'
                 check (status in ('pendiente','pagado','preparando','enviado',
                                   'entregado','cancelado','reembolsado')),
  currency       text not null default 'COP',
  subtotal       int  not null default 0,
  discount       int  not null default 0,
  shipping_cost  int  not null default 0,
  total          int  not null default 0,
  shipping_address jsonb,                           -- snapshot of the address at purchase
  payment_method text,                              -- wompi | mercadopago | contra_entrega | whatsapp
  payment_ref    text,                              -- gateway transaction id
  customer_notes text,
  placed_at      timestamptz not null default now(),
  paid_at        timestamptz,
  shipped_at     timestamptz,
  delivered_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (user_id is not null or guest_email is not null)
);
create index if not exists idx_orders_user   on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_placed on public.orders(placed_at desc);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  variant_id   uuid references public.product_variants(id) on delete set null,
  -- snapshots (survive catalog edits/deletions):
  sku          text not null,
  product_name text not null,
  variant_name text,
  unit_price   int  not null,
  quantity     int  not null check (quantity > 0),
  line_total   int  not null,
  created_at   timestamptz not null default now()
);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ---------------------------------------------------------------------
-- FAVORITES (wishlist)
-- ---------------------------------------------------------------------
create table if not exists public.favorites (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  added_at   timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------------------------------------------------------------------
-- REVIEWS  (+ keeps products.rating aggregated)
-- ---------------------------------------------------------------------
create table if not exists public.product_reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  rating     int  not null check (rating between 1 and 5),
  title      text,
  comment    text,
  is_approved boolean not null default true,       -- flip default to false for moderation
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists idx_reviews_product on public.product_reviews(product_id);

create or replace function public.refresh_product_rating()
returns trigger
language plpgsql security definer set search_path = public as $$
declare pid uuid;
begin
  pid := coalesce(new.product_id, old.product_id);
  update public.products p
     set rating = (select round(avg(rating)::numeric, 1)
                     from public.product_reviews r
                    where r.product_id = pid and r.is_approved)
   where p.id = pid;
  return coalesce(new, old);
end $$;

drop trigger if exists trg_reviews_rating on public.product_reviews;
create trigger trg_reviews_rating
  after insert or update or delete on public.product_reviews
  for each row execute function public.refresh_product_rating();

-- updated_at triggers (reuses set_updated_at from catalog schema)
drop trigger if exists trg_profiles_updated  on public.profiles;
create trigger trg_profiles_updated  before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists trg_addresses_updated on public.addresses;
create trigger trg_addresses_updated before update on public.addresses
  for each row execute function public.set_updated_at();
drop trigger if exists trg_carts_updated     on public.carts;
create trigger trg_carts_updated     before update on public.carts
  for each row execute function public.set_updated_at();
drop trigger if exists trg_orders_updated    on public.orders;
create trigger trg_orders_updated    before update on public.orders
  for each row execute function public.set_updated_at();
drop trigger if exists trg_reviews_updated   on public.product_reviews;
create trigger trg_reviews_updated   before update on public.product_reviews
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles        enable row level security;
alter table public.addresses       enable row level security;
alter table public.carts           enable row level security;
alter table public.cart_items      enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.favorites       enable row level security;
alter table public.product_reviews enable row level security;

-- profiles: own row only
drop policy if exists "own profile select" on public.profiles;
create policy "own profile select" on public.profiles
  for select using (id = auth.uid());
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- addresses: full CRUD on own
drop policy if exists "own addresses" on public.addresses;
create policy "own addresses" on public.addresses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- carts: own cart
drop policy if exists "own cart" on public.carts;
create policy "own cart" on public.carts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- cart_items: through cart ownership
drop policy if exists "own cart items" on public.cart_items;
create policy "own cart items" on public.cart_items
  for all
  using (exists (select 1 from public.carts c
                  where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.carts c
                  where c.id = cart_id and c.user_id = auth.uid()));

-- orders: read own; create own *pending* orders. No client update/delete
-- (status changes & guest orders are service-role / Edge Function only).
drop policy if exists "own orders select" on public.orders;
create policy "own orders select" on public.orders
  for select using (user_id = auth.uid());
drop policy if exists "own orders insert" on public.orders;
create policy "own orders insert" on public.orders
  for insert with check (user_id = auth.uid() and status = 'pendiente');

-- order_items: read own; insert only into own pending orders
drop policy if exists "own order items select" on public.order_items;
create policy "own order items select" on public.order_items
  for select using (exists (select 1 from public.orders o
                             where o.id = order_id and o.user_id = auth.uid()));
drop policy if exists "own order items insert" on public.order_items;
create policy "own order items insert" on public.order_items
  for insert with check (exists (select 1 from public.orders o
                                  where o.id = order_id
                                    and o.user_id = auth.uid()
                                    and o.status = 'pendiente'));

-- favorites: full CRUD on own
drop policy if exists "own favorites" on public.favorites;
create policy "own favorites" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reviews: public read of approved; write own
drop policy if exists "read approved reviews" on public.product_reviews;
create policy "read approved reviews" on public.product_reviews
  for select using (is_approved or user_id = auth.uid());
drop policy if exists "own reviews insert" on public.product_reviews;
create policy "own reviews insert" on public.product_reviews
  for insert with check (user_id = auth.uid());
drop policy if exists "own reviews update" on public.product_reviews;
create policy "own reviews update" on public.product_reviews
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own reviews delete" on public.product_reviews;
create policy "own reviews delete" on public.product_reviews
  for delete using (user_id = auth.uid());

-- =====================================================================
-- LUVORA · Supabase schema  (PostgreSQL 15 / Supabase)
-- Adult intimate-wellness e-commerce catalog.
-- Run this ONCE before seed.sql.  Safe to re-run (idempotent-ish: uses
-- "if not exists" / "create or replace").
--
-- Currency: all prices are COP (Colombian pesos) stored as integer cents-less
-- (i.e. 29999 = $29.999 COP).  Use a `currency` column for future-proofing.
-- =====================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- fuzzy / ILIKE search
create extension if not exists "unaccent";       -- accent-insensitive search

-- Immutable unaccent wrapper so it can be used in generated columns / indexes
create or replace function public.f_unaccent(text)
returns text language sql immutable parallel safe as $$
  select public.unaccent('public.unaccent', $1)
$$;

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- CATEGORIES  (top level)
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  key          text not null unique,          -- stable machine key: 'lubricantes'
  name         text not null,
  slug         text not null unique,
  icon         text,
  description   text,
  position     int  not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SUBCATEGORIES  (one level under a category)
-- ---------------------------------------------------------------------
create table if not exists public.subcategories (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.categories(id) on delete cascade,
  name         text not null,
  slug         text not null,
  position     int  not null default 0,
  created_at   timestamptz not null default now(),
  unique (category_id, slug)
);

-- ---------------------------------------------------------------------
-- TAGS  (free-form facets: flavors, effects, materials, badges...)
-- ---------------------------------------------------------------------
create table if not exists public.tags (
  id    uuid primary key default gen_random_uuid(),
  slug  text not null unique,
  label text not null
);

-- ---------------------------------------------------------------------
-- PRODUCTS
-- A product groups one or more variants (flavor / scent / color / size).
-- `subcategory` is stored as text (denormalized label) for simplicity; the
-- canonical subcategory list lives in `subcategories`.
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  brand        text not null default 'Entre Besos',
  category_id  uuid not null references public.categories(id) on delete restrict,
  subcategory  text,
  description   text,
  price        int  not null,                 -- min variant price (COP)
  price_max    int  not null,                 -- max variant price (COP)
  currency     text not null default 'COP',
  badges       text[] not null default '{}',  -- nuevo | mas_vendido | regalo_ideal | premium
  catalog      text,                          -- eb1 | eb2 | mallas (provenance)
  source_page  int,
  sku_primary  text,                          -- default variant sku
  attributes   jsonb not null default '{}'::jsonb,
  rating       numeric(2,1),
  is_active    boolean not null default true,
  is_18_plus   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- Full-text search vector (Spanish, accent-insensitive) over name+brand+description.
  search_tsv   tsvector generated always as (
      setweight(to_tsvector('spanish', f_unaccent(coalesce(name,''))), 'A') ||
      setweight(to_tsvector('spanish', f_unaccent(coalesce(brand,''))), 'B') ||
      setweight(to_tsvector('spanish', f_unaccent(coalesce(description,''))), 'C')
  ) stored
);

-- ---------------------------------------------------------------------
-- PRODUCT VARIANTS  (the sellable SKUs — this is where ref numbers live)
-- ---------------------------------------------------------------------
create table if not exists public.product_variants (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete cascade,
  sku          text not null unique,          -- catalog ref number
  name         text not null,                 -- 'Fresa', 'Fucsia', '45 ml', 'Único'
  option_type  text not null default 'default', -- sabor|aroma|color|tamaño|modelo|tipo|genero|default
  price        int  not null,
  currency     text not null default 'COP',
  size         text,
  barcode      text,
  stock        int  not null default 0,
  in_stock     boolean not null default true,
  position     int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- PRODUCT IMAGES  (Supabase Storage object paths)
-- ---------------------------------------------------------------------
create table if not exists public.product_images (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  variant_id     uuid references public.product_variants(id) on delete set null,
  path           text not null,               -- storage object path in the 'product-images' bucket
  alt            text,
  position       int  not null default 0,
  is_primary     boolean not null default false,
  source_catalog text,                         -- provenance: which pdf
  source_page    int,                          -- provenance: which page
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- PRODUCT ⇄ TAGS  (many-to-many)
-- ---------------------------------------------------------------------
create table if not exists public.product_tags (
  product_id uuid not null references public.products(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- ---------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------
create index if not exists idx_products_category   on public.products(category_id);
create index if not exists idx_products_active      on public.products(is_active);
create index if not exists idx_products_price       on public.products(price);
create index if not exists idx_products_brand       on public.products(brand);
create index if not exists idx_products_badges      on public.products using gin(badges);
create index if not exists idx_products_attrs       on public.products using gin(attributes jsonb_path_ops);
create index if not exists idx_products_search      on public.products using gin(search_tsv);
create index if not exists idx_products_name_trgm   on public.products using gin(f_unaccent(name) gin_trgm_ops);
create index if not exists idx_variants_product     on public.product_variants(product_id);
create index if not exists idx_variants_instock     on public.product_variants(in_stock);
create index if not exists idx_images_product       on public.product_images(product_id);
create index if not exists idx_subcats_category     on public.subcategories(category_id);
create index if not exists idx_product_tags_tag     on public.product_tags(tag_id);

-- updated_at triggers
drop trigger if exists trg_products_updated  on public.products;
create trigger trg_products_updated  before update on public.products
  for each row execute function public.set_updated_at();
drop trigger if exists trg_variants_updated  on public.product_variants;
create trigger trg_variants_updated  before update on public.product_variants
  for each row execute function public.set_updated_at();
drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- VIEW: catalog rows ready for a product grid (min price, primary image, tags)
-- ---------------------------------------------------------------------
create or replace view public.v_product_cards as
select
  p.id, p.slug, p.name, p.brand, p.price, p.price_max, p.currency,
  p.badges, p.rating, p.subcategory,
  c.name  as category, c.slug as category_slug,
  (select path from public.product_images i
     where i.product_id = p.id order by i.is_primary desc, i.position limit 1) as primary_image,
  (select count(*) from public.product_variants v where v.product_id = p.id) as variant_count,
  coalesce(array_agg(distinct t.slug) filter (where t.slug is not null), '{}') as tags
from public.products p
join public.categories c on c.id = p.category_id
left join public.product_tags pt on pt.product_id = p.id
left join public.tags t on t.id = pt.tag_id
where p.is_active
group by p.id, c.name, c.slug;

-- ---------------------------------------------------------------------
-- RPC: faceted search + filter (used by the storefront /tienda page)
--   q          : free text (name/brand/description, accent-insensitive)
--   cat_slugs  : filter by category slugs
--   tag_slugs  : filter by tags (AND-less: any match)
--   min/max    : price band in COP
--   sort       : 'relevance' | 'price_asc' | 'price_desc' | 'newest'
-- ---------------------------------------------------------------------
create or replace function public.search_products(
  q          text    default null,
  cat_slugs  text[]  default null,
  tag_slugs  text[]  default null,
  min_price  int     default null,
  max_price  int     default null,
  badges_in  text[]  default null,
  sort       text    default 'relevance',
  lim        int     default 24,
  off        int     default 0
) returns setof public.v_product_cards
language sql stable as $$
  select vc.*
  from public.v_product_cards vc
  join public.products p on p.id = vc.id
  where (q is null or p.search_tsv @@ plainto_tsquery('spanish', f_unaccent(q))
                   or f_unaccent(p.name) ilike '%'||f_unaccent(q)||'%')
    and (cat_slugs is null or vc.category_slug = any(cat_slugs))
    and (min_price is null or p.price >= min_price)
    and (max_price is null or p.price <= max_price)
    and (badges_in is null or p.badges && badges_in)
    and (tag_slugs is null or vc.tags && tag_slugs)
  order by
    case when sort='price_asc'  then p.price end asc nulls last,
    case when sort='price_desc' then p.price end desc nulls last,
    case when sort='newest'     then p.created_at end desc nulls last,
    case when sort='relevance' and q is not null
         then ts_rank(p.search_tsv, plainto_tsquery('spanish', f_unaccent(q))) end desc nulls last,
    p.name asc
  limit lim offset off;
$$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- Public storefront: anonymous users may READ active catalog data only.
-- Writes are restricted to the service role (bypasses RLS) / admins.
-- =====================================================================
alter table public.categories       enable row level security;
alter table public.subcategories    enable row level security;
alter table public.tags             enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images   enable row level security;
alter table public.product_tags     enable row level security;

-- public read policies
drop policy if exists "read categories"    on public.categories;
create policy "read categories"    on public.categories       for select using (is_active);
drop policy if exists "read subcategories" on public.subcategories;
create policy "read subcategories" on public.subcategories    for select using (true);
drop policy if exists "read tags"          on public.tags;
create policy "read tags"          on public.tags             for select using (true);
drop policy if exists "read products"      on public.products;
create policy "read products"      on public.products         for select using (is_active);
drop policy if exists "read variants"      on public.product_variants;
create policy "read variants"      on public.product_variants for select using (true);
drop policy if exists "read images"        on public.product_images;
create policy "read images"        on public.product_images   for select using (true);
drop policy if exists "read product_tags"  on public.product_tags;
create policy "read product_tags"  on public.product_tags     for select using (true);
-- NOTE: no INSERT/UPDATE/DELETE policies => only the service_role key can write.

-- =====================================================================
-- STORAGE  (product photography lives in a public bucket)
-- The seed references paths like:  products/{catalog}/{slug}/01.webp
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read of product images; writes restricted to service role.
drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images" on storage.objects
  for select using ( bucket_id = 'product-images' );

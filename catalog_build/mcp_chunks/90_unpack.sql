
create extension if not exists "uuid-ossp";

-- tags (deterministic ids: uuid5(NS,'tag:'||slug))
insert into public.tags (id, slug, label)
select uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'tag:'||tg), tg, replace(tg,'-',' ')
from (select distinct jsonb_array_elements_text(data->'t') tg from public._staging_luvora) x
on conflict (slug) do nothing;

-- products
insert into public.products (id, slug, name, brand, category_id, subcategory, description,
                             price, price_max, currency, badges, catalog, source_page,
                             sku_primary, attributes, is_active)
select
  uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'product:'||(data->>'s')),
  data->>'s', data->>'n', data->>'b',
  uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'category:'||(data->>'c')),
  data->>'sc', data->>'d',
  (data->>'p')::int, (data->>'pm')::int, 'COP',
  coalesce(array(select jsonb_array_elements_text(data->'bg')), '{}'),
  data->>'cl', (data->>'pg')::int, data->>'sp',
  coalesce(data->'at','{}'::jsonb), true
from public._staging_luvora
on conflict (id) do update set name=excluded.name, brand=excluded.brand,
  description=excluded.description, price=excluded.price, price_max=excluded.price_max,
  badges=excluded.badges, subcategory=excluded.subcategory, attributes=excluded.attributes;

-- variants
insert into public.product_variants (id, product_id, sku, name, option_type, price,
                                     currency, size, position, in_stock)
select
  uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'variant:'||(v->>'k')),
  uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'product:'||(s.data->>'s')),
  v->>'k', v->>'n', coalesce(v->>'o','default'), (v->>'p')::int, 'COP', v->>'z',
  ord::int, true
from public._staging_luvora s
cross join lateral jsonb_array_elements(s.data->'v') with ordinality as t(v, ord)
on conflict (sku) do update set price=excluded.price, name=excluded.name, size=excluded.size;

-- primary images (path convention: products/{catalog}/{slug}/01.webp)
insert into public.product_images (id, product_id, path, alt, position, is_primary,
                                   source_catalog, source_page)
select
  uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'image:products/'||(data->>'cl')||'/'||(data->>'s')||'/01'),
  uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'product:'||(data->>'s')),
  'products/'||(data->>'cl')||'/'||(data->>'s')||'/01.webp',
  (data->>'n')||' — LUVORA', 1, true, data->>'cl', (data->>'pg')::int
from public._staging_luvora
on conflict (id) do nothing;

-- product_tags
insert into public.product_tags (product_id, tag_id)
select uuid_generate_v5('5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e'::uuid, 'product:'||(s.data->>'s')), tg.id
from public._staging_luvora s
cross join lateral jsonb_array_elements_text(s.data->'t') as tt(slug)
join public.tags tg on tg.slug = tt.slug
on conflict do nothing;

drop table public._staging_luvora;

select 'categories' t, count(*) n from public.categories
union all select 'subcategories', count(*) from public.subcategories
union all select 'tags',          count(*) from public.tags
union all select 'products',      count(*) from public.products
union all select 'variants',      count(*) from public.product_variants
union all select 'images',        count(*) from public.product_images
union all select 'product_tags',  count(*) from public.product_tags
order by 1;

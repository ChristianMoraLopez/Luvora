# -*- coding: utf-8 -*-
"""
Export compact SQL chunks for loading the catalog through the Supabase MCP
connector (execute_sql has payload limits, so we stage minified JSONB and
unpack server-side with uuid_generate_v5 => same deterministic ids as
products.json / seed.sql).

Emits into mcp_chunks/:
  00_cats.sql         categories + subcategories (direct, ids from categories.json)
  10_stage_XX.sql     insert minified product JSON into public._staging_luvora
  90_unpack.sql       tags/products/variants/images/product_tags from staging
"""
import json, os, io, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "mcp_chunks")
os.makedirs(OUT, exist_ok=True)

NS = "5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e"
CHUNK_BYTES = 32_000   # per execute_sql call

cats = json.load(open(os.path.join(HERE, "categories.json"), encoding="utf-8"))["categories"]
prods = json.load(open(os.path.join(HERE, "products.json"), encoding="utf-8"))["products"]


def q(s):  # sql string literal
    return "NULL" if s is None else "'" + str(s).replace("'", "''") + "'"


# ---- 00: categories + subcategories ----
rows = []
for c in cats:
    rows.append(f"('{c['id']}',{q(c['key'])},{q(c['name'])},{q(c['slug'])},{q(c['icon'])},{q(c['description'])},{c['position']})")
sql = ("insert into public.categories (id,key,name,slug,icon,description,position) values\n"
       + ",\n".join(rows)
       + "\non conflict (id) do update set name=excluded.name, description=excluded.description, position=excluded.position;\n\n")
rows = []
for c in cats:
    for s in c["subcategories"]:
        rows.append(f"('{s['id']}','{c['id']}',{q(s['name'])},{q(s['slug'])},{s['position']})")
sql += ("insert into public.subcategories (id,category_id,name,slug,position) values\n"
        + ",\n".join(rows)
        + "\non conflict (id) do update set name=excluded.name, position=excluded.position;\n")
open(os.path.join(OUT, "00_cats.sql"), "w", encoding="utf-8").write(sql)

# ---- compact product records ----
def compact(p):
    d = {
        "s": p["slug"], "n": p["name"], "b": p["brand"], "c": p["category_key"],
        "sc": p["subcategory"], "d": p["description"], "p": p["price"],
        "pm": p["price_max"], "bg": p["badges"], "cl": p["catalog"],
        "pg": p["source_page"], "sp": p["sku_primary"], "at": p["attributes"],
        "t": p["tags"],
        "v": [{"k": v["sku"], "n": v["name"], "o": v["option_type"],
               "p": v["price"], "z": v["size"]} for v in p["variants"]],
    }
    return json.dumps(d, ensure_ascii=False, separators=(",", ":"))

recs = [compact(p) for p in prods]

# ---- chunk into staging inserts (dollar-quoted json arrays) ----
chunks, cur, size = [], [], 0
for r in recs:
    if size + len(r.encode("utf-8")) > CHUNK_BYTES and cur:
        chunks.append(cur); cur, size = [], 0
    cur.append(r); size += len(r.encode("utf-8"))
if cur:
    chunks.append(cur)

header = "create table if not exists public._staging_luvora (data jsonb);\n"
for i, ch in enumerate(chunks, 1):
    arr = "[" + ",".join(ch) + "]"
    assert "$j$" not in arr
    body = (header if i == 1 else "") + (
        "insert into public._staging_luvora (data)\n"
        f"select jsonb_array_elements($j${arr}$j$::jsonb);\n"
    )
    open(os.path.join(OUT, f"10_stage_{i:02d}.sql"), "w", encoding="utf-8").write(body)

# ---- 90: unpack ----
unpack = f"""
create extension if not exists "uuid-ossp";

-- tags (deterministic ids: uuid5(NS,'tag:'||slug))
insert into public.tags (id, slug, label)
select uuid_generate_v5('{NS}'::uuid, 'tag:'||tg), tg, replace(tg,'-',' ')
from (select distinct jsonb_array_elements_text(data->'t') tg from public._staging_luvora) x
on conflict (slug) do nothing;

-- products
insert into public.products (id, slug, name, brand, category_id, subcategory, description,
                             price, price_max, currency, badges, catalog, source_page,
                             sku_primary, attributes, is_active)
select
  uuid_generate_v5('{NS}'::uuid, 'product:'||(data->>'s')),
  data->>'s', data->>'n', data->>'b',
  uuid_generate_v5('{NS}'::uuid, 'category:'||(data->>'c')),
  data->>'sc', data->>'d',
  (data->>'p')::int, (data->>'pm')::int, 'COP',
  coalesce(array(select jsonb_array_elements_text(data->'bg')), '{{}}'),
  data->>'cl', (data->>'pg')::int, data->>'sp',
  coalesce(data->'at','{{}}'::jsonb), true
from public._staging_luvora
on conflict (id) do update set name=excluded.name, brand=excluded.brand,
  description=excluded.description, price=excluded.price, price_max=excluded.price_max,
  badges=excluded.badges, subcategory=excluded.subcategory, attributes=excluded.attributes;

-- variants
insert into public.product_variants (id, product_id, sku, name, option_type, price,
                                     currency, size, position, in_stock)
select
  uuid_generate_v5('{NS}'::uuid, 'variant:'||(v->>'k')),
  uuid_generate_v5('{NS}'::uuid, 'product:'||(s.data->>'s')),
  v->>'k', v->>'n', coalesce(v->>'o','default'), (v->>'p')::int, 'COP', v->>'z',
  ord::int, true
from public._staging_luvora s
cross join lateral jsonb_array_elements(s.data->'v') with ordinality as t(v, ord)
on conflict (sku) do update set price=excluded.price, name=excluded.name, size=excluded.size;

-- primary images (path convention: products/{{catalog}}/{{slug}}/01.webp)
insert into public.product_images (id, product_id, path, alt, position, is_primary,
                                   source_catalog, source_page)
select
  uuid_generate_v5('{NS}'::uuid, 'image:products/'||(data->>'cl')||'/'||(data->>'s')||'/01'),
  uuid_generate_v5('{NS}'::uuid, 'product:'||(data->>'s')),
  'products/'||(data->>'cl')||'/'||(data->>'s')||'/01.webp',
  (data->>'n')||' — LUVORA', 1, true, data->>'cl', (data->>'pg')::int
from public._staging_luvora
on conflict (id) do nothing;

-- product_tags
insert into public.product_tags (product_id, tag_id)
select uuid_generate_v5('{NS}'::uuid, 'product:'||(s.data->>'s')), tg.id
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
"""
open(os.path.join(OUT, "90_unpack.sql"), "w", encoding="utf-8").write(unpack)

files = sorted(os.listdir(OUT))
total = 0
for f in files:
    n = os.path.getsize(os.path.join(OUT, f)); total += n
    print(f"  {f}: {n/1024:.1f} KB")
print(f"total: {total/1024:.1f} KB in {len(files)} files ({len(chunks)} staging chunks, {len(recs)} products)")

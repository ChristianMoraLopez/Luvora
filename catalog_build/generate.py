# -*- coding: utf-8 -*-
"""
LUVORA catalog build pipeline.

Reads catalog_data.py (single source of truth) and emits:
  - products.json      : normalized product records (with variants, images, tags)
  - categories.json    : category tree with stable ids
  - seed.sql           : idempotent Supabase seed (categories, products, variants, images, tags)

All ids are deterministic uuid5 values derived from natural keys (slug / sku),
so re-running the pipeline is stable and the seed is idempotent (ON CONFLICT).

Run:  python generate.py
"""
import json, re, uuid, unicodedata, sys, io, os
from collections import OrderedDict, Counter
import catalog_data as C

# Force UTF-8 stdout on Windows consoles
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

NS = uuid.UUID("5b2f3c9a-0e6b-4a1d-9c7e-1f2a3b4c5d6e")  # fixed namespace for LUVORA
HERE = os.path.dirname(os.path.abspath(__file__))

# catalog code -> metadata
CATALOG_META = {
    "EB1":    {"slug": "eb1",    "name": "Entre Besos 1 · 2025", "year": 2025},
    "EB2":    {"slug": "eb2",    "name": "Entre Besos 2 · 2025", "year": 2025},
    "MALLAS": {"slug": "mallas", "name": "Colección Mallas",     "year": 2025},
}


def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def slugify(s):
    s = strip_accents(s).lower()
    s = s.replace("&", " y ").replace("+", " mas ")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def uid(kind, key):
    return str(uuid.uuid5(NS, f"{kind}:{key}"))


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------
def build_categories():
    cats = []
    for pos, c in enumerate(C.CATEGORIES, 1):
        cid = uid("category", c["key"])
        subs = []
        for spos, sub in enumerate(c["subcategories"], 1):
            subs.append(OrderedDict(
                id=uid("subcategory", c["key"] + "/" + slugify(sub)),
                name=sub, slug=slugify(sub), position=spos,
            ))
        cats.append(OrderedDict(
            id=cid, key=c["key"], name=c["name"], slug=slugify(c["name"]),
            icon=c.get("icon"), description=c["description"], position=pos,
            subcategories=subs,
        ))
    return cats


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------
def auto_tags(p, cat_name, sub, variants):
    tags = set(p.get("tags", []))
    tags.add(slugify(cat_name))
    if sub:
        tags.add(slugify(sub))
    brand = p.get("brand", C.BRAND_DEFAULT)
    if brand and brand != C.BRAND_DEFAULT:
        tags.add(slugify(brand))
    for b in p.get("badges", []):
        tags.add(b)
    # variant option types become facet tags (e.g. sabor, color, aroma)
    for v in variants:
        if v.get("type"):
            tags.add(v["type"])
    return sorted(tags)


def build_products(categories):
    cat_by_key = {c["key"]: c for c in categories}
    products = []
    used_slugs = {}
    all_tags = {}          # tag_slug -> label
    variant_skus = Counter()

    for p in C.PRODUCTS:
        cat = cat_by_key[p["cat"]]
        sub = p.get("sub")
        brand = p.get("brand", C.BRAND_DEFAULT)
        catalog = p["catalog"]
        cmeta = CATALOG_META[catalog]

        # ---- normalize variants ----
        raw_variants = p.get("variants")
        if not raw_variants:
            raw_variants = [dict(sku=p["ref"], label="Único", type="default",
                                 price=p["price"], size=p.get("size"))]
        variants = []
        for pos, v in enumerate(raw_variants, 1):
            price = v.get("price", p["price"])
            size = v.get("size", p.get("size"))
            sku = v["sku"]
            variant_skus[sku] += 1
            variants.append(OrderedDict(
                id=uid("variant", sku), sku=sku, name=v["label"],
                option_type=v.get("type", "default"), price=price,
                currency=C.CURRENCY, size=size, position=pos, in_stock=True,
            ))
        base_price = min(v["price"] for v in variants)
        max_price = max(v["price"] for v in variants)

        # ---- slug (unique) ----
        base_slug = slugify(p["name"])
        slug = base_slug
        if slug in used_slugs:
            # disambiguate with first sku
            slug = f"{base_slug}-{variants[0]['sku']}".lower()
        used_slugs[slug] = True
        pid = uid("product", slug)

        # ---- tags ----
        tags = auto_tags(p, cat["name"], sub, variants)
        for t in tags:
            all_tags.setdefault(t, t.replace("-", " "))

        # ---- images (target storage paths; populate from catalog source) ----
        img_base = f"products/{cmeta['slug']}/{slug}"
        images = [OrderedDict(
            id=uid("image", f"{img_base}/01"),
            path=f"{img_base}/01.webp", alt=f"{p['name']} — LUVORA",
            position=1, is_primary=True,
            source=OrderedDict(catalog=cmeta["slug"], page=p["page"]),
        )]

        # ---- attributes ----
        attributes = OrderedDict()
        sizes = sorted({v["size"] for v in variants if v.get("size")})
        if sizes:
            attributes["sizes"] = sizes
        opt_types = sorted({v["option_type"] for v in variants
                            if v["option_type"] != "default"})
        if opt_types:
            attributes["variant_axes"] = opt_types
        attributes["is_18_plus"] = True

        products.append(OrderedDict(
            id=pid, slug=slug, name=p["name"], brand=brand,
            category_id=cat["id"], category_key=cat["key"],
            category=cat["name"], subcategory=sub,
            description=p["desc"],
            price=base_price, price_max=max_price, currency=C.CURRENCY,
            badges=p.get("badges", []),
            catalog=cmeta["slug"], catalog_name=cmeta["name"], source_page=p["page"],
            variant_count=len(variants), sku_primary=variants[0]["sku"],
            attributes=attributes, tags=tags,
            variants=variants, images=images,
            is_active=True,
        ))

    # sanity: duplicate SKUs?
    dupes = {k: v for k, v in variant_skus.items() if v > 1}
    if dupes:
        print("WARNING duplicate SKUs:", dupes)

    return products, all_tags


# ---------------------------------------------------------------------------
# SQL seed
# ---------------------------------------------------------------------------
def sql_str(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"


def sql_arr(items):
    if not items:
        return "'{}'"
    inner = ",".join('"' + str(i).replace('"', '\\"') + '"' for i in items)
    return "'{" + inner + "}'"


def build_seed(categories, products, all_tags):
    L = []
    L.append("-- LUVORA seed data (generated by generate.py). Idempotent.")
    L.append("-- Prices are in COP (Colombian pesos), integer, no decimals.")
    L.append("begin;")
    L.append("")

    # categories
    L.append("-- ============ categories ============")
    for c in categories:
        L.append(
            "insert into categories (id, key, name, slug, icon, description, position) values "
            f"('{c['id']}', {sql_str(c['key'])}, {sql_str(c['name'])}, {sql_str(c['slug'])}, "
            f"{sql_str(c['icon'])}, {sql_str(c['description'])}, {c['position']})\n"
            "  on conflict (id) do update set name=excluded.name, description=excluded.description, "
            "icon=excluded.icon, position=excluded.position;"
        )
    L.append("")

    # subcategories
    L.append("-- ============ subcategories ============")
    for c in categories:
        for s in c["subcategories"]:
            L.append(
                "insert into subcategories (id, category_id, name, slug, position) values "
                f"('{s['id']}', '{c['id']}', {sql_str(s['name'])}, {sql_str(s['slug'])}, {s['position']})\n"
                "  on conflict (id) do update set name=excluded.name, position=excluded.position;"
            )
    L.append("")

    # tags
    L.append("-- ============ tags ============")
    for tslug, tlabel in sorted(all_tags.items()):
        tid = uid("tag", tslug)
        L.append(
            "insert into tags (id, slug, label) values "
            f"('{tid}', {sql_str(tslug)}, {sql_str(tlabel)})\n"
            "  on conflict (slug) do nothing;"
        )
    L.append("")

    # products
    L.append("-- ============ products ============")
    for p in products:
        L.append(
            "insert into products (id, slug, name, brand, category_id, subcategory, description, "
            "price, price_max, currency, badges, catalog, source_page, sku_primary, attributes, "
            "is_active) values (\n"
            f"  '{p['id']}', {sql_str(p['slug'])}, {sql_str(p['name'])}, {sql_str(p['brand'])}, "
            f"'{p['category_id']}', {sql_str(p['subcategory'])}, {sql_str(p['description'])},\n"
            f"  {p['price']}, {p['price_max']}, {sql_str(p['currency'])}, {sql_arr(p['badges'])}, "
            f"{sql_str(p['catalog'])}, {p['source_page']}, {sql_str(p['sku_primary'])}, "
            f"{sql_str(json.dumps(p['attributes'], ensure_ascii=False))}::jsonb, true)\n"
            "  on conflict (id) do update set name=excluded.name, brand=excluded.brand, "
            "price=excluded.price, price_max=excluded.price_max, description=excluded.description, "
            "badges=excluded.badges, subcategory=excluded.subcategory, attributes=excluded.attributes;"
        )
    L.append("")

    # variants
    L.append("-- ============ product_variants ============")
    for p in products:
        for v in p["variants"]:
            L.append(
                "insert into product_variants (id, product_id, sku, name, option_type, price, currency, "
                "size, position, in_stock) values (\n"
                f"  '{v['id']}', '{p['id']}', {sql_str(v['sku'])}, {sql_str(v['name'])}, "
                f"{sql_str(v['option_type'])}, {v['price']}, {sql_str(v['currency'])}, "
                f"{sql_str(v['size'])}, {v['position']}, {str(v['in_stock']).lower()})\n"
                "  on conflict (sku) do update set price=excluded.price, name=excluded.name, "
                "size=excluded.size, in_stock=excluded.in_stock;"
            )
    L.append("")

    # images
    L.append("-- ============ product_images ============")
    for p in products:
        for img in p["images"]:
            L.append(
                "insert into product_images (id, product_id, path, alt, position, is_primary, "
                "source_catalog, source_page) values (\n"
                f"  '{img['id']}', '{p['id']}', {sql_str(img['path'])}, {sql_str(img['alt'])}, "
                f"{img['position']}, {str(img['is_primary']).lower()}, "
                f"{sql_str(img['source']['catalog'])}, {img['source']['page']})\n"
                "  on conflict (id) do nothing;"
            )
    L.append("")

    # product_tags
    L.append("-- ============ product_tags ============")
    for p in products:
        for t in p["tags"]:
            tid = uid("tag", t)
            L.append(
                "insert into product_tags (product_id, tag_id) values "
                f"('{p['id']}', '{tid}') on conflict do nothing;"
            )
    L.append("")
    L.append("commit;")
    return "\n".join(L)


# ---------------------------------------------------------------------------
# Facets / filter config for the storefront (/tienda)
# ---------------------------------------------------------------------------
# Tag option_types that behave as structured variant/attribute facets
FACET_AXES = {
    "sabor":  "Sabor",
    "aroma":  "Aroma / Fragancia",
    "color":  "Color",
    "tamano": "Tamaño",
    "modelo": "Modelo",
    "efecto": "Efecto",
}
# curated "experience" tags worth exposing as quick filters
EFFECT_TAGS = ["efecto-calor", "efecto-frio", "electrizante", "multiorgasmo",
               "estrechante", "retardante", "anal", "feromonas", "natural",
               "base-agua", "comestible", "recargable", "usb", "app", "silicona-medica"]


def build_facets(categories, products):
    prices = sorted(p["price"] for p in products)
    lo, hi = prices[0], prices[-1]
    bands = [
        {"label": "Hasta $15.000",     "min": 0,     "max": 15000},
        {"label": "$15.000 – $30.000", "min": 15000, "max": 30000},
        {"label": "$30.000 – $60.000", "min": 30000, "max": 60000},
        {"label": "$60.000 – $120.000","min": 60000, "max": 120000},
        {"label": "Más de $120.000",   "min": 120000,"max": 10**9},
    ]
    brands = Counter(p["brand"] for p in products)
    badges = Counter(b for p in products for b in p["badges"])
    tagcount = Counter(t for p in products for t in p["tags"])

    def opts(counter, keys=None):
        items = ((k, counter[k]) for k in (keys or counter))
        return [{"value": k, "count": counter[k]} for k, _ in
                sorted(((k, counter.get(k, 0)) for k in (keys or counter)),
                       key=lambda x: (-x[1], x[0])) if counter.get(k, 0)]

    facets = OrderedDict(
        currency=C.CURRENCY,
        price=OrderedDict(min=lo, max=hi, bands=bands, ui="range_slider + bands"),
        categories=[OrderedDict(slug=c["slug"], name=c["name"],
                                subcategories=[s["slug"] for s in c["subcategories"]])
                    for c in categories],
        brands=[{"value": b, "count": n} for b, n in brands.most_common() if n],
        badges=[{"value": b, "count": n,
                 "label": {"nuevo": "Nuevo", "mas_vendido": "Más vendido",
                           "regalo_ideal": "Regalo ideal", "premium": "Premium"}.get(b, b)}
                for b, n in badges.most_common()],
        effects=[{"value": t, "count": tagcount[t]} for t in EFFECT_TAGS if tagcount.get(t)],
        variant_axes=[{"value": k, "label": v} for k, v in FACET_AXES.items()],
        sort_options=[
            {"value": "relevance",  "label": "Relevancia"},
            {"value": "price_asc",  "label": "Precio: menor a mayor"},
            {"value": "price_desc", "label": "Precio: mayor a menor"},
            {"value": "newest",     "label": "Novedades"},
        ],
        search=OrderedDict(rpc="search_products", full_text=True, language="spanish",
                           accent_insensitive=True, fuzzy_trigram=True),
    )
    return facets


def main():
    categories = build_categories()
    products, all_tags = build_products(categories)

    with open(os.path.join(HERE, "categories.json"), "w", encoding="utf-8") as f:
        json.dump(OrderedDict(count=len(categories), categories=categories),
                  f, ensure_ascii=False, indent=2)

    total_skus = sum(p["variant_count"] for p in products)
    meta = OrderedDict(
        brand="LUVORA", source="Entre Besos 2025 catalogs", currency=C.CURRENCY,
        product_count=len(products), sku_count=total_skus, tag_count=len(all_tags),
        note="Prices in COP (integer). Images are target storage paths to be populated.",
    )
    with open(os.path.join(HERE, "products.json"), "w", encoding="utf-8") as f:
        json.dump(OrderedDict(meta=meta, products=products), f, ensure_ascii=False, indent=2)

    seed = build_seed(categories, products, all_tags)
    with open(os.path.join(HERE, "seed.sql"), "w", encoding="utf-8") as f:
        f.write(seed)

    facets = build_facets(categories, products)
    with open(os.path.join(HERE, "facets.json"), "w", encoding="utf-8") as f:
        json.dump(facets, f, ensure_ascii=False, indent=2)

    # report
    by_cat = Counter(p["category"] for p in products)
    by_catalog = Counter(p["catalog"] for p in products)
    print(f"categories : {len(categories)}")
    print(f"products   : {len(products)}")
    print(f"SKUs       : {total_skus}")
    print(f"tags       : {len(all_tags)}")
    print("by category:")
    for k, v in by_cat.most_common():
        print(f"   {v:>3}  {k}")
    print("by catalog :")
    for k, v in by_catalog.most_common():
        print(f"   {v:>3}  {k}")
    print("\nwrote: products.json, categories.json, seed.sql")


if __name__ == "__main__":
    main()

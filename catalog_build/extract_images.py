# -*- coding: utf-8 -*-
"""
LUVORA image extraction + mapping.

For each source PDF it:
  1. Renders a per-page JPEG preview        -> catalog_images/{catalog}/page-NN.jpg
  2. Extracts embedded raster images        -> catalog_images/{catalog}/page-NN/IMG.ext
     (skips tiny icons / decorative sprites < MIN_PX on the short side)
  3. Builds image_map.json : for every product (and SKU) the source catalog+page,
     the candidate raw images on that page, and the TARGET Supabase Storage path
     that the storefront expects (products/{catalog}/{slug}/01.webp).

This is the bridge between "PDF pages" and "clean product photos in Storage":
an operator uses page-NN.jpg + the candidate crops to fill each target path.

Run:  python extract_images.py
"""
import fitz, os, io, sys, json, glob
from collections import OrderedDict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                    # e:\Proyectos Con Amor\Luvora
OUT  = os.path.join(HERE, "catalog_images")
MIN_PX = 200                                    # ignore images smaller than this (icons)
PREVIEW_ZOOM = 1.1                              # page preview scale

def find_pdf(substr, exclude_dup=True):
    for f in glob.glob(os.path.join(ROOT, "*.pdf")):
        base = os.path.basename(f)
        if substr.lower() in base.lower():
            if exclude_dup and base.rstrip(".pdf").endswith("(1)"):
                continue
            return f
    return None

CATALOGS = {
    "eb1":    find_pdf("besos 1"),
    "eb2":    sorted([f for f in glob.glob(os.path.join(ROOT, "*.pdf")) if "Besos 2" in os.path.basename(f)], key=len)[0],
    "mallas": find_pdf("MALLAS"),
}

def extract():
    os.makedirs(OUT, exist_ok=True)
    page_assets = {}   # (catalog, page) -> [raw image relative paths]
    for cat, path in CATALOGS.items():
        d = fitz.open(path)
        cat_dir = os.path.join(OUT, cat)
        os.makedirs(cat_dir, exist_ok=True)
        seen = set()
        for i, page in enumerate(d, 1):
            # 1) page preview
            pix = page.get_pixmap(matrix=fitz.Matrix(PREVIEW_ZOOM, PREVIEW_ZOOM))
            preview_rel = f"{cat}/page-{i:02d}.jpg"
            pix.save(os.path.join(OUT, preview_rel), jpg_quality=80)
            # 2) embedded images
            assets = []
            imgs = page.get_images(full=True)
            for k, info in enumerate(imgs, 1):
                xref = info[0]
                if xref in seen:
                    continue
                seen.add(xref)
                try:
                    base = d.extract_image(xref)
                except Exception:
                    continue
                w, h = base.get("width", 0), base.get("height", 0)
                if min(w, h) < MIN_PX:
                    continue
                ext = base["ext"]
                pdir = os.path.join(cat_dir, f"page-{i:02d}")
                os.makedirs(pdir, exist_ok=True)
                rel = f"{cat}/page-{i:02d}/{k:02d}.{ext}"
                with open(os.path.join(OUT, rel), "wb") as fh:
                    fh.write(base["image"])
                assets.append(OrderedDict(file=rel, w=w, h=h))
            page_assets[(cat, i)] = assets
        n = d.page_count
        d.close()
        print(f"{cat}: {n} pages processed")
    return page_assets


def build_map(page_assets):
    prods = json.load(open(os.path.join(HERE, "products.json"), encoding="utf-8"))["products"]
    entries = []
    for p in prods:
        cat, page = p["catalog"], p["source_page"]
        assets = page_assets.get((cat, page), [])
        entries.append(OrderedDict(
            product_slug=p["slug"], name=p["name"], catalog=cat, source_page=page,
            skus=[v["sku"] for v in p["variants"]],
            target_storage_path=p["images"][0]["path"],   # products/{cat}/{slug}/01.webp
            page_preview=f"{cat}/page-{page:02d}.jpg",
            candidate_raw_images=[a["file"] for a in assets],
        ))
    doc = OrderedDict(
        bucket="product-images",
        convention="products/{catalog}/{product-slug}/{NN}.webp  (01 = primary; add 02,03… for gallery)",
        variant_convention="products/{catalog}/{product-slug}/variants/{sku}.webp  (color/flavor swatch)",
        note=("candidate_raw_images are ALL sizable rasters on the source page — a page may hold "
              "several products, so an operator picks/crops the right shot into target_storage_path. "
              "For MALLAS each spread is a single high-res photo per product."),
        count=len(entries),
        items=entries,
    )
    with open(os.path.join(HERE, "image_map.json"), "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
    total_raw = sum(len(e["candidate_raw_images"]) for e in entries)
    print(f"image_map.json: {len(entries)} products, {total_raw} candidate raw image refs")


if __name__ == "__main__":
    pa = extract()
    build_map(pa)

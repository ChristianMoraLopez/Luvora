# LUVORA · Catálogo (Entre Besos → LUVORA)

Extracción completa y modelo de datos e-commerce a partir de los **3 catálogos PDF**
de *Entre Besos 2025*, listo para **Supabase** + un frontend (React/Next).

> **Marca de tienda:** LUVORA (bienestar íntimo / adult retail, tono elegante "sin tabúes").
> **Fuente de productos:** catálogos *Entre Besos* (distribuidor).
> **Moneda:** **COP** (pesos colombianos). En los PDF los precios se escriben `$29.999` = **29 999 COP**.
> Los precios en EUR que aparecían en los mockups de diseño eran *placeholders*.

---

## 1. Qué se extrajo

| Catálogo | Archivo | Págs | Tipo | Productos |
|---|---|---:|---|---:|
| **EB1** | `Catálogo Entre besos 1-2025.pdf` | 50 | texto + imágenes | 91 |
| **EB2** | `Catalogo Entre Besos 2 -2025…pdf` | 64 | texto + imágenes | 120 |
| **MALLAS** | `CATALOGO MALLAS…pdf` | 24 | solo imágenes (leído visualmente) | 24 |
| | | | **Total** | **235 productos / 299 SKUs** |

Cada producto tiene: **nombre, descripción, marca, SKU/ref, categoría + subcategoría,
precio (COP), variantes, imágenes (rutas destino) y tags**. Los productos que se venden
en varios **sabores / aromas / colores / tamaños** se modelan como **1 producto con N
variantes**, cada variante con su propio `ref` (SKU) — así se preserva cada referencia
del catálogo sin inflar el número de fichas.

## 2. Archivos generados (deliverables)

| # | Pedido | Archivo |
|---|---|---|
| 1 | `products.json` | **`products.json`** — 235 productos normalizados (variantes, imágenes, tags, ids uuid estables) |
| 2 | `categories.json` | **`categories.json`** — árbol de 7 categorías + 46 subcategorías |
| 3 | SQL schema para Supabase | **`schema.sql`** — tablas, índices, FTS español, RLS, bucket de Storage, RPC de búsqueda |
| 4 | Seed scripts | **`seed.sql`** — 2 448 `insert` idempotentes (categorías, subcategorías, tags, productos, variantes, imágenes, product_tags) |
| 5 | Estrategia de imágenes | **`image_map.json`** + **`extract_images.py`** + carpeta **`catalog_images/`** |
| 6 | Jerarquía de categorías | **`categories.json`** + §4 de este README |
| 7 | Filtros y facetas | **`facets.json`** + §6 de este README |

**Fuente de la verdad + pipeline** (reproducible):
`catalog_data.py` (datos curados) → `generate.py` → `products.json` · `categories.json` · `seed.sql` · `facets.json`.
`extract_images.py` → previews de página + imágenes embebidas + `image_map.json`.

```bash
pip install pymupdf
python generate.py         # products.json, categories.json, seed.sql, facets.json
python extract_images.py   # catalog_images/*, image_map.json
```

## 3. Despliegue en Supabase

```bash
# 1) esquema
psql "$SUPABASE_DB_URL" -f schema.sql
# 2) datos
psql "$SUPABASE_DB_URL" -f seed.sql
# 3) imágenes (una vez recortadas/curadas) al bucket público 'product-images'
#    respetando la convención de rutas (ver §5)
```
El seed usa **UUIDs deterministas** (`uuid5` sobre slug/sku), por lo que re-ejecutarlo es
**idempotente** (`on conflict`). RLS: lectura pública sólo de filas activas; las escrituras
requieren la `service_role` key.

## 4. Jerarquía de categorías sugerida

```
Lubricantes y Geles (75)
  ├─ Saborizados y comestibles · Efecto calor · Efecto frío
  ├─ Electrizantes / Vibradores líquidos · Anales · Estrechantes
  └─ Multiorgásmicos · Retardantes · Naturales y neutros · Especiales
Cosmética Íntima y Sensual (33)
  └─ Feromonas · Splash corporales · Aceites de masaje · Velas de masaje
     · Cuidado íntimo · Cremas y exfoliantes
Juguetes (68)
  ├─ Vibradores · Succionadores · Balas · Huevos · Anillos para pene
  ├─ Consoladores y dildos · Masturbadores masculinos · Fundas para pene
  └─ Plugs y juguetes anales · Bolas chinas y Kegel · Bombas · Arneses · Higiene
Bienestar y Salud Sexual (8)
  └─ Potenciadores y suplementos · Perlas y esferas · Cuidado especial
Lencería y Mallas (25)
  └─ Mallas cortas · Mallas enteras · Mallas dos piezas · Medias · Pezoneras
BDSM y Fetish (11)
  └─ Esposas · Látigos y paletas · Mordazas · Antifaces · Kits fetish · Rol y cosplay
Juegos y Regalos (15)
  └─ Juegos de mesa y cartas · Dados · Kits y combos
```
*(entre paréntesis = nº de productos activos por categoría)*

Notas de modelado:
- **Feromonas** aparecen en cosmética (splash/lociones/cremas/brillos). Es un fuerte gancho
  de marketing → se mantiene como **tag** transversal (`feromonas`, 16 productos) además de la categoría.
- **Mallas** es lencería pura (bodysuits, bodystockings, sets, medias). Colores (Fucsia/Verde/Negro)
  = variantes de un mismo estilo (Tessa, Jadel, Tina).
- Higiene (duchas/enemas) va bajo Juguetes por afinidad de uso; podría separarse a "Salud" si se prefiere.

## 5. Estrategia de imágenes (Supabase Storage)

**Bucket público:** `product-images`.

**Convención de rutas** (la referencia `products.json` ya apunta a estas rutas destino):
```
products/{catalog}/{product-slug}/01.webp     ← imagen principal (primary)
products/{catalog}/{product-slug}/02.webp …   ← galería
products/{catalog}/{product-slug}/variants/{sku}.webp   ← swatch por color/sabor
```
Ej.: `products/mallas/malla-tessa/01.webp`, `products/mallas/malla-tessa/variants/11717.webp`.

**Cómo llenarlas** — `extract_images.py` genera:
- `catalog_images/{catalog}/page-NN.jpg` — **preview de cada página** (para ubicar el producto).
- `catalog_images/{catalog}/page-NN/KK.ext` — **imágenes embebidas** (fotos reales) de esa página.
- `image_map.json` — por cada producto: `catalog`, `source_page`, `skus`, `target_storage_path`,
  `page_preview` y `candidate_raw_images` (todas las fotos grandes de la página).

Flujo del operador: abre `page_preview`, elige/recorta la foto correcta de `candidate_raw_images`,
la sube como `target_storage_path`. En **MALLAS** cada spread es una sola foto de alta resolución por
producto (mapeo casi 1:1). En EB1/EB2 una página tiene varios productos → se recorta el correcto.

**Optimización recomendada:** convertir a **WebP** (4:5 tarjetas/hero, 1:1 thumbs, según el handoff de diseño),
2–3 tamaños (`?width=` transformador de Supabase), `cache-control` largo, y `alt` = `"{nombre} — LUVORA"`
(ya provisto en `product_images.alt`).

## 6. Filtros y facetas recomendados (frontend `/tienda`)

Definidos en **`facets.json`** y servidos por el RPC `search_products(...)` de `schema.sql`.

| Faceta | UI | Fuente |
|---|---|---|
| **Categoría / Subcategoría** | checkboxes (sidebar) | `categories` |
| **Precio (COP)** | slider + bandas (`≤15k`, `15–30k`, `30–60k`, `60–120k`, `>120k`) | `price` |
| **Marca** | checkboxes | Entre Besos (189), Sen (16), Erotic Scence, Satisfyer, Svakom, Elixir, Bassika, Magnetic, Erotika, Feroz, HemoLub, Gladme, Pocket Pleasure |
| **Destacados / Badges** | chips | `nuevo` (25), `premium` (6), `regalo_ideal`, `mas_vendido` |
| **Efecto / Experiencia** | chips | `efecto-calor`, `efecto-frio`, `electrizante`, `multiorgasmo`, `estrechante`, `retardante`, `anal`, `feromonas`, `natural`, `comestible`, `recargable`, `usb`, `app` |
| **Ejes de variante** | selector en ficha | `sabor`, `aroma`, `color`, `tamaño`, `modelo` |
| **Orden** | dropdown | Relevancia · Precio ↑ · Precio ↓ · Novedades |
| **Búsqueda** | input | FTS español, sin acentos, con trigram fuzzy (`search_products`) |

Ejemplo de llamada desde el cliente (supabase-js):
```ts
const { data } = await supabase.rpc('search_products', {
  q: 'vibrador recargable',
  cat_slugs: ['juguetes'],
  tag_slugs: ['recargable','usb'],
  min_price: 30000, max_price: 120000,
  badges_in: ['nuevo'],
  sort: 'price_asc', lim: 24, off: 0,
});
```

## 7. Notas y salvedades

- **+18 / discreción:** todo el catálogo es adulto (`is_18_plus = true`). El diseño LUVORA
  contempla envío discreto y empaque neutro; considerar un *age-gate* según jurisdicción.
- **Precios "LLEVA CADA UNO":** varios ítems se anuncian como precio *por unidad* dentro de un set;
  se almacena ese precio unitario.
- **Duplicados de nombre:** hay dos "Musa" en MALLAS (ref 11727 catsuit c/liguero y 11729 tiras
  frontales) → slugs desambiguados por ref.
- **Registros INVIMA / sanitarios** aparecen en algunos suplementos (EB1 p31) — verificar
  vigencia antes de publicar claims de salud.
- Las descripciones son fieles al catálogo (resumidas); revisar tono/legal antes de producción.

# PROMPT — Wire the LUVORA storefront to Supabase (copy & paste in full)

> **Language note:** This prompt is in **English**, but the storefront UI/copy stays in **Spanish (Colombia)**. Do not translate any user-facing text.

You are working on **LUVORA**, an intimate-wellness / adult-retail (+18) brand with an elegant, sensual, "no-taboo" tone.

**The storefront is already built** (Next.js App Router, all pages and components in `src/`). Right now it renders from **local mock data** in `src/data/` (`products.ts`, `categories.ts`, `orders.ts`). The Supabase database **already exists and is fully seeded**. Your job is to **replace the local mock data sources with live Supabase reads, keeping the exact same UI and design.** Do NOT redesign, do NOT create tables or seeds — only consume what is described below.

## Stack (already in place)
- **Next.js 15 (App Router) + React 19 + Tailwind CSS + Framer Motion** (animations minimal and elegant).
- Supabase via `@supabase/ssr`. The helpers already exist: `src/lib/supabase/server.ts` (Server Components / Route Handlers) and `src/lib/supabase/client.ts` (Client Components).
- **Currency formatting already exists** at `src/lib/format.ts` → `formatCOP(value)` uses `Intl.NumberFormat('es-CO', { currency: 'COP', maximumFractionDigits: 0 })`. Prices in the DB are integers (`29999` → `$29.999`). **Always use `formatCOP`. NEVER use € or EUR.**

## Environment (must be set up — currently missing)
`.env.local` does **not** exist yet; only `.env.example` is present. Create `.env.local` by copying `.env.example` and filling in the real values:
```
NEXT_PUBLIC_SUPABASE_URL="https://vptjcnasqwgvzhnnotix.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<the project's publishable/anon key from Supabase → Project Settings → API>"
```
> The code reads `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the publishable/anon key — safe to expose; RLS protects everything). Never expose the `service_role` key on the client.

## Design (mandatory, high fidelity — already implemented, keep it)
The current UI already follows `design_handoff_luvora_website/README.md` (Home, Shop, Product) with these tokens. When rewiring data, **do not change the visual design**:
- Colors: burgundy `#6B1E3A` (primary), footer `#571731`, cream `#F8F6F2`, blush `#F2E5E2`, sand `#E8D9C5`/`#D9B48C`, mauve `#A96E7E`, rose `#D6A5B4`, ink `#1F1F1F`. Flat design, no shadows.
- Google Fonts: Playfair Display (headings), Montserrat (UI/body).
- Product card: 4:5 image → category eyebrow → name (Playfair 20px) → price. Hover `translateY(-4px)`.
- The mockup's sample products (Ondule, € prices) are placeholders — **always use the real products from the DB.** Note: the design handoff shows `€`; that is a mistake — the store is Colombia-only, so prices are **COP** via `formatCOP`.

## Database (Supabase — already seeded: 235 products / 299 SKUs / 7 categories / 46 subcategories)

### Catalog (public read with the anon/publishable key)
- **`v_product_cards`** (view, for grids): `id, slug, name, brand, price, price_max, currency, badges[], rating, subcategory, category, category_slug, primary_image, variant_count, tags[]`. *(Verified: exists with exactly these columns.)*
- **RPC `search_products(q, cat_slugs, tag_slugs, min_price, max_price, badges_in, sort, lim, off)`** → rows of `v_product_cards`. `sort ∈ 'relevance' | 'price_asc' | 'price_desc' | 'newest'`. Spanish full-text search, accent-insensitive. Use it for the Shop page (filters + sort + pagination). *(Verified: exists.)*
- **`products`** (detail by `slug`): `name, brand, description, price, price_max, badges, subcategory, attributes` (jsonb with `sizes[]`, `variant_axes[]`), `sku_primary`.
- **`product_variants`**: `sku`, `name` (e.g. "Whisky", "Fucsia", "45 ml"), `option_type` (`sabor | aroma | color | tamaño | modelo | tipo | genero | default`), `price`, `size`, `in_stock`. Show a variant selector on the product page; if `option_type = 'default'`, hide the selector.
- **`product_images`**: `path`, `alt`, `is_primary`. Paths live in the **public** bucket `product-images`: URL = `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}` (e.g. `products/eb1/<slug>/01.webp`). **The bucket is currently EMPTY (0 objects)** → keep the existing `<ProductImage>` fallback (see below). Images can be uploaded later without any code change.
- **`categories`** (7) and **`subcategories`** (46): navigation and filters. Order by `position`.
- Recommended facets (Shop sidebar): categories (checkbox), price bands (≤15k, 15–30k, 30–60k, 60–120k, >120k), brand, badges (`nuevo`→"NUEVO", `mas_vendido`→"MÁS VENDIDO", `regalo_ideal`→"REGALO IDEAL", `premium`→"PREMIUM"), and effect chips (tags: `efecto-calor`, `efecto-frio`, `electrizante`, `multiorgasmo`, `estrechante`, `retardante`, `feromonas`, `recargable`, `app`).

Examples:
```ts
// Shop grid (server component or route handler)
const { data } = await supabase.rpc('search_products', {
  q: query || null,
  cat_slugs: cats.length ? cats : null,
  tag_slugs: null, min_price, max_price, badges_in: null,
  sort, lim: 24, off: page * 24,
})

// Product detail
const { data: product } = await supabase.from('products')
  .select('*, product_variants(*), product_images(*), categories(name, slug)')
  .eq('slug', params.slug).single()
```

### Users (requires Supabase Auth; RLS: each user sees only their own rows)
- **`profiles`** (auto-created on signup): `full_name, phone, birth_date, avatar_url, marketing_opt_in`.
- **`addresses`**: own CRUD; Colombia fields (`city, department, delivery_notes, is_default`).
- **`carts` + `cart_items`** (`variant_id, quantity`): cart for logged-in users. Guests → cart in `localStorage`, merged into the DB cart on sign-in.
- **`orders` + `order_items`**: purchase history. The customer can read their own orders and CREATE orders only with `status='pendiente'` (+ items with snapshot `sku, product_name, variant_name, unit_price, quantity, line_total`). `order_number` is auto-generated (LUV-000001). Status/payment changes = backend (no payment gateway yet — MercadoPago keys are stubbed in `.env.example`; checkout ends on a confirmation page showing the order number).
- **`favorites`**: wishlist (heart on cards).
- **`product_reviews`**: `rating 1–5, title, comment`; public read, write your own. The average updates `products.rating` automatically.

## Current state → what to fix (the actual task)
The storefront exists but is fed by `src/data/*`. Rewire each surface to Supabase **without changing the design**:

| Surface | File(s) | Fix |
|---|---|---|
| Shop grid + filters + sort + pagination | `src/components/product/Catalog.tsx`, `Filters.tsx`, `src/app/tienda/page.tsx` | Fetch via `search_products` (server-side) instead of importing `@/data/products`. Drive filters/sort/page from the URL (`?q=&cat=&min=&max=&sort=&page=`). Align the UI sort values with the RPC: map `destacados→relevance`, `nuevos→newest`, `precio-asc→price_asc`, `precio-desc→price_desc`. The current `PAGE_SIZE=9` can stay, but pass it as `lim`/`off` to the RPC. |
| Home "most wanted" / best sellers / categories | `src/components/sections/BestSellers.tsx`, `CouplesKits.tsx`, `FeaturedCategories.tsx`, `src/app/page.tsx` | Pull 8 rows from `v_product_cards` (prioritize badges) and categories from `categories`. |
| Product detail + variants | `src/app/producto/[slug]/page.tsx`, `PurchasePanel.tsx`, `ProductGallery.tsx` | Load by `slug` from `products` with `product_variants`, `product_images`, `categories`. Dynamic price per selected variant. Related = same category. |
| Cart / checkout / account / wishlist / orders | `src/app/carrito`, `checkout`, `cuenta`, `wishlist`, `cuenta/pedidos`, `src/app/api/checkout/route.ts` | Back with Auth + the `carts/cart_items/orders/order_items/favorites/addresses/profiles` tables (RLS). Keep guest cart in `localStorage`, merge on sign-in. |
| Product images | `src/components/product/ProductImage.tsx` | **Already implemented** — branded fallback (blush/champagne wash + heart monogram + name, 4:5) when there is no image. Keep it; just feed real Storage URLs built from `product_images.path`. It handles the empty bucket gracefully today. |
| Currency | `src/lib/format.ts` | **Already correct** (`formatCOP`). Just make sure every price renders through it. |

## Pages / routes (already scaffolded)
1. `/` **Home** — brand hero, trust badges, "Los más deseados" (8 from `v_product_cards`, badges first), CTA to /tienda.
2. `/tienda` **Listing** — filter sidebar + grid + sort + pagination, all via `search_products` with URL state.
3. `/producto/[slug]` **Detail** — gallery, variant selector with dynamic price, quantity, "AÑADIR AL CARRITO", accordion (Detalles / Materiales y cuidado / Envío discreto), related (same category).
4. `/carrito` and `/checkout` — summary, address (from `addresses` or a form), creates order+items `pendiente`.
5. `/cuenta` — profile, addresses, **order history** (orders with items), favorites.
6. **+18 age gate**: modal on first visit (persist in `localStorage`), on-brand styling.

## Rules
- Copy in Spanish, premium and discreet tone ("Envío discreto 24–72h · Empaque 100% neutro · Pago seguro").
- Server Components for catalog data; Client Components only where there is interaction (filters, cart, variants).
- Never expose the `service_role` key; the anon/publishable key is enough (RLS already protects everything).
- Accessible: alt texts (already provided in `product_images.alt`), focus states, AA contrast.
- **Do not change the visual design.** This is a data-wiring pass: swap `@/data/*` for Supabase, nothing more.

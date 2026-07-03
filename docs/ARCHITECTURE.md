# LUVORA — Arquitectura

## 1. Stack y renderizado

- **Next.js 15 (App Router) + React 19 + TypeScript.**
- **Server Components por defecto**; `"use client"` solo donde hay interacción/estado (carrito, filtros, intro, drawers).
- **Estrategia de render por ruta:**
  - `/`, `/tienda`, páginas de contenido → estáticas (`○`).
  - `/producto/[slug]` → **SSG** con `generateStaticParams` (`●`).
  - `/api/checkout` → dinámica (`ƒ`).
- Datos hoy en `src/data/` (seed local). El límite server/cliente ya está trazado para sustituirlos por consultas a Supabase sin refactor.

## 2. Estado (Zustand, persistido)

| Store | Persistencia | Rol |
|---|---|---|
| `cart` | localStorage | Ítems, apertura del drawer, subtotal/conteo derivados |
| `wishlist` | localStorage | IDs guardados |
| `intro` | sessionStorage | La intro se muestra una vez por sesión |

Los stores son la fuente de verdad del cliente; al integrar auth, el carrito/wishlist pueden **sincronizarse** con Supabase por usuario (merge al iniciar sesión).

## 3. Intro de marca (Lottie)

`SiteShell` (cliente) orquesta la intro:

1. En primer render (SSR/no-JS) la página se ve completa → SEO y resiliencia.
2. Tras `mount`, si no se ha reproducido y no hay `reduced-motion`, se monta `IntroAnimation`: un overlay ivory que reproduce el logotipo animado de la marca en **Lottie** (`public/lottie/luvora-wordmark.json`). El JSON se hace `fetch` en runtime para no cargar el bundle inicial.
3. Al terminar la animación —o con clic/tap para saltar— `onComplete` marca la sesión y `SiteShell` hace **cross-fade** (`AnimatePresence` sobre el overlay + fade-in del contenido) hacia el sitio.

El fondo del Lottie se ajustó a ivory (igual que el sitio) para que la transición sea sin costuras. `LayoutGroup` sigue disponible para animaciones de layout compartidas; el header ya no depende de la intro para su logo.

> El Lottie fue creado en **Jitter**; se le retiró la marca de agua (capa/precomp de la esquina inferior derecha) y se recoloreó el fondo. El origen sin modificar queda en `Scene-1.json` (raíz).

## 4. Supabase — estrategia de integración

**Clientes** (`src/lib/supabase/`): `client.ts` (browser, anon key) y `server.ts` (Server Components / Route Handlers / Server Actions, sesión por cookies — `cookies()` async en Next 15).

**Esquema** (`supabase/schema.sql`): `profiles` (1:1 con `auth.users`, rol `customer|admin`), `categories`, `products`, `product_images`, `product_variants`, `wishlists`, `orders`, `order_items`, `subscribers`. Enums para categoría, estado de pedido y rol.

**RLS (Row Level Security):**
- Catálogo (`products/categories/images/variants`): lectura pública (solo `active`); escritura solo `is_admin()`.
- `profiles`: cada usuario el suyo; admin todos.
- `wishlists`: privadas al usuario.
- `orders/order_items`: el usuario ve los suyos; se insertan **server-side** (service role) tras confirmar el pago; admin gestiona.
- `subscribers`: inserción abierta; lectura solo admin.

**Migración desde el seed local:**
1. Ejecuta `schema.sql` (SQL editor o `supabase db push`).
2. Genera tipos: `supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts`.
3. Sustituye las funciones de `src/data/products.ts` por consultas (`getProductBySlug`, `getBestSellers`, …) desde Server Components.
4. Sube fotografía a **Storage** y guarda URLs en `product_images` (host ya permitido en `next.config.ts`).

**Auth:** magic link (`supabase.auth.signInWithOtp`). La UI ya existe en `/cuenta`; añade un `middleware.ts` para refrescar sesión y proteger `/cuenta/**` y `/admin`.

## 5. Mercado Pago (Colombia)

Flujo Checkout Pro:

1. Cliente hace `POST /api/checkout` con los ítems.
2. El route handler crea una *preference* (moneda `COP`, `back_urls`, `notification_url`) y responde `init_point`.
3. El cliente redirige a Mercado Pago.
4. **Pendiente:** webhook `POST /api/webhooks/mercadopago` → valida el pago, marca el pedido `pagado` y descuenta stock.

**Endurecimiento obligatorio en producción:** recalcular precios desde la BD (nunca confiar en el precio del cliente), persistir el pedido como `pendiente` antes de pagar y usar su id como `external_reference`, y verificar la firma del webhook (`MERCADOPAGO_WEBHOOK_SECRET`).

## 6. Responsive

Mobile-first con grids `auto-fit/auto-fill` + `minmax()` y tipografía `clamp()` → reflujo natural sin breakpoints frágiles. Navegación en `MobileMenu` (drawer) < `md`; filtros del catálogo en drawer < `lg`. Objetivos táctiles ≥ 40px.

## 7. Rendimiento

- `next/font` (sin CLS), `next/image` para fotos reales (AVIF/WebP), `optimizePackageImports` para framer-motion/lottie, Lottie cargado *lazy* por `fetch`.
- Animaciones solo `transform`/`opacity`.

## 8. Pendientes para producción

- Fotografía real + `product_images`.
- Conectar datos a Supabase y auth middleware.
- Webhook de Mercado Pago + emails transaccionales.
- Páginas de ayuda/legales (`/ayuda/*`, `/legal/*`).
- **Verificación de edad (+18)** si la jurisdicción lo exige (hoy solo hay aviso en el footer).
- Analítica con consentimiento y sitemap/robots.

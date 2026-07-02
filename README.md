# LUVORA

Bienestar íntimo premium — tienda e-commerce para Colombia (**es-CO / COP**).
Elegante, discreta y cálida: la experiencia de una marca de skincare de lujo aplicada al cuidado íntimo.

Construida con **Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lottie · Supabase · Mercado Pago**.

---

## ✨ Destacados

- **Intro de marca** con *shared layout animation* (Framer Motion): el corazón late dos veces → aparece el punto dorado → se revela «LUVORA» → el logotipo viaja fluidamente hasta su lugar en el header. Respeta `prefers-reduced-motion` y se muestra una vez por sesión.
- **Sistema de diseño** completo y tokenizado (una sola fuente de verdad en `src/config/tokens.ts`, reflejada en Tailwind y CSS variables).
- **Recreación fiel del handoff** (Inicio / Tienda / Producto) localizada a pesos colombianos.
- **Catálogo** con filtros, orden y paginación; **carrito** persistente (drawer + página); **checkout** con Mercado Pago; **wishlist**, **cuenta**, **pedidos** y **panel de administración**.
- **Accesible por defecto**: foco visible, `prefers-reduced-motion`, navegación por teclado, `aria-*`, skip-link, contraste cuidado.

---

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completa tus claves de Supabase y Mercado Pago
npm run dev                  # http://localhost:3000
```

Scripts:

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |

> Sin variables de entorno la app funciona en modo demo (datos locales en `src/data/`). Mercado Pago y Supabase se activan al configurar `.env.local`.

---

## 🗂️ Estructura

```
src/
├─ app/                      # App Router (rutas + API)
│  ├─ layout.tsx             # fuentes (next/font), metadata es-CO, SiteShell
│  ├─ page.tsx               # Inicio (landing)
│  ├─ tienda/                # Catálogo
│  ├─ producto/[slug]/       # Detalle de producto (SSG)
│  ├─ carrito/ checkout/     # Carrito y pago
│  ├─ wishlist/ cuenta/ …    # Wishlist, cuenta, pedidos, admin, nosotros, contacto
│  └─ api/checkout/          # Preferencia de pago Mercado Pago
├─ components/
│  ├─ brand/                 # Logo, Icons, LottieWordmark
│  ├─ intro/                 # IntroAnimation (timeline)
│  ├─ layout/                # Header, Footer, PromoBar, MobileMenu, SearchModal, SiteShell
│  ├─ ui/                    # Button, Input, Drawer, Accordion, Badge, Skeleton, …
│  ├─ product/               # ProductCard, ProductGrid, Gallery, Filters, Catalog, PurchasePanel
│  ├─ cart/                  # CartDrawer
│  └─ sections/              # Hero, TrustBadges, FeaturedCategories, BestSellers, CouplesKits, Testimonials, Newsletter
├─ config/                   # tokens.ts (design tokens), site.ts (nav/config)
├─ data/                     # products, categories, orders, colombia (seed local)
├─ lib/                      # utils (cn/slug), format (COP), motion (variants), supabase/
├─ store/                    # zustand: cart, wishlist, intro
└─ types/                    # interfaces de dominio
supabase/schema.sql          # esquema Postgres + RLS + seed
docs/                        # DESIGN-SYSTEM.md, ARCHITECTURE.md
```

---

## 🎨 Marca

| Token | Valor | Uso |
|---|---|---|
| Burgundy | `#6B1E3A` | Primario |
| Burgundy oscuro | `#571731` | Footer |
| Blush | `#D6A5B4` | Acento / resaltados |
| Blush suave | `#F2E5E2` | Fondos tintados |
| Champagne | `#E8D9C5` | Rellenos / botón primario |
| Oro / arena | `#D9B48C` | Punto dorado, hover |
| Ivory | `#F8F6F2` | Fondo |
| Ink | `#1F1F1F` | Texto |

**Tipografía:** Playfair Display (títulos) · Montserrat (cuerpo/UI), vía `next/font`.
Detalles completos en [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md).

---

## 🔌 Integraciones

- **Supabase** — auth (magic link), catálogo, pedidos, wishlist, newsletter. Esquema + RLS en [`supabase/schema.sql`](supabase/schema.sql); clientes en `src/lib/supabase/`. Estrategia en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
- **Mercado Pago (Colombia)** — `POST /api/checkout` crea una *preference* (Checkout Pro) y redirige a `init_point`. Falta el webhook `/api/webhooks/mercadopago` para confirmar pagos (documentado).

---

## 📦 Assets de la marca

- `public/brand/heart.svg` — corazón (line-icon, usado en el logo).
- `public/lottie/luvora-wordmark.json` — logotipo animado (Lottie), opcional vía `LottieWordmark`.
- Fotografía de producto: **pendiente**. Mientras tanto se renderiza un *placeholder* de marca (`ProductImage`). Sustituir por URLs de Supabase Storage manteniendo las proporciones **4:5** (tarjetas/hero) y **1:1** (miniaturas).

---

## ✅ Estado

Verificado: `tsc --noEmit` limpio · `next build` correcto (22 rutas) · SSR de todas las páginas responde 200 · precios en COP (`$ 289.900`).

Pendiente para producción: fotografía real, conectar datos a Supabase (hoy en `src/data/`), webhook de Mercado Pago, páginas de ayuda/legales, y verificación de edad (+18) según requisitos legales.

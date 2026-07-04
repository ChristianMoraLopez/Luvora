<div align="center">

<img src="src/app/icon.svg" width="92" alt="LUVORA" />

# LUVORA

**Bienestar íntimo premium — tienda e-commerce para Colombia**

_Placer, conexión y bienestar · sin tabúes_

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_·_Auth_·_Storage-3ECF8E?logo=supabase&logoColor=white)
![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Checkout-00B1EA?logo=mercadopago&logoColor=white)
![es-CO](https://img.shields.io/badge/es--CO-COP-6B1E3A)

</div>

---

LUVORA es una marca colombiana de bienestar íntimo. La experiencia se diseñó con el
cuidado de una marca de skincare de lujo: **elegante, discreta y cálida** — nada de
neón, vulgaridad ni clichés de sex-shop. Todo en **español (es-CO)** y **pesos
colombianos (COP)**, con envío discreto y empaque 100% neutro.

- 🌐 **Producción:** [www.luvoraoficial.com](https://www.luvoraoficial.com)
- 🎨 Paleta: burdeos `#6B1E3A` · crema `#F8F6F2` · blush `#D6A5B4` · champán `#E8D9C5` · tinta `#1F1F1F`
- 🔤 Tipografía: **Playfair Display** (títulos) · **Montserrat** (UI/cuerpo)

---

## 🎬 La animación de marca (intro)

<div align="center">
<img src="public/brand/heart-full.svg" width="64" alt="corazón LUVORA" />
</div>

Al entrar, la marca se presenta con una **animación en Lottie** (`public/lottie/luvora-wordmark.json`)
y un **hand-off con _shared layout_ de Framer Motion**:

1. El **corazón** aparece y **late dos veces**.
2. Cae un **punto dorado** sobre el corazón.
3. Se revela el logotipo **«LUVORA»**.
4. El logotipo hace **cross-fade** al lockup de marca (corazón + palabra) y…
5. …**escala y viaja hasta su posición final en el header** (`layoutId="brand-lockup"`),
   mientras el contenido de la página aparece con un _fade_.

Se muestra **una vez por sesión**, **después** de la verificación de edad (+18), respeta
`prefers-reduced-motion` y permite **saltar** con un clic. Todo corre sobre `transform`/`opacity`
(60 fps). El icono del corazón proviene del arte oficial (`public/brand/heart.svg`, dos trazos + punto)
y se reutiliza en header, footer, favicon (`src/app/icon.svg`), placeholders y 404.

---

## 🛍️ Los productos — catálogo real (Supabase)

**235 productos · 299 SKUs · 7 categorías · 46 subcategorías · 14 marcas**, con precios
en **COP** (de `$3.999` a `$494.999`). Los datos viven en Supabase; el storefront lee la
vista `v_product_cards` y el RPC de búsqueda `search_products` (full-text en español,
insensible a acentos).

| Categoría | Productos | Subcategorías |
|---|--:|--:|
| Lubricantes y Geles | 75 | 10 |
| Juguetes | 68 | 13 |
| Cosmética Íntima y Sensual | 33 | 6 |
| Lencería y Mallas | 25 | 5 |
| Juegos y Regalos | 15 | 3 |
| BDSM y Fetish | 11 | 6 |
| Bienestar y Salud Sexual | 8 | 3 |

**Cada producto** tiene: nombre, marca, descripción, categoría/subcategoría, precio (y
rango `price_max` para variantes), calificación, **badges** (`nuevo`, `mas_vendido`,
`regalo_ideal`, `premium` — 30 productos destacados) y **variantes** (`sabor`, `aroma`,
`color`, `tamaño`, `modelo`, `tipo`, `genero`) con su propio SKU, precio y stock.

**Chips de efecto (tags)** para filtrar: `efecto-calor` · `efecto-frio` · `electrizante` ·
`multiorgasmo` · `estrechante` · `retardante` · `feromonas` · `recargable` · `app`.

**Fotografía:** las imágenes viven en el bucket público `product-images` de Supabase
Storage (webp, una por producto). El componente `<ProductImage>` construye la URL desde
`product_images.path` y, si falta la foto, muestra un **placeholder de marca** (degradado
champán + monograma del corazón) — sin romper nada.

---

## 📄 Las páginas

| Ruta | Página | Qué hace |
|---|---|---|
| `/` | **Inicio** | Intro, hero con tarjeta de marca «LUVORA», insignias de confianza, categorías, «Los más deseados», kits para parejas, testimonios, newsletter. |
| `/tienda` | **Tienda** | Grid + filtros (categoría, precio, efectos) + orden + paginación, todo dirigido por la URL (`?q=&cat=&min=&max=&sort=&page=`) vía `search_products`. |
| `/producto/[slug]` | **Producto** | Galería, selector de variante con **precio dinámico**, cantidad, «Añadir al carrito», acordeón (Detalles / Materiales y cuidado / Envío discreto) y relacionados. |
| `/carrito` | **Carrito** | Líneas, cantidades, subtotal (persistente en `localStorage`). |
| `/checkout` | **Pago** | Contacto + envío con **tarifas por zona** (Medellín/área metro/Antioquia/nacional), resumen y **Mercado Pago**. |
| `/checkout/exito` | **Confirmación** | Protegida: exige un pedido real **pagado y verificado** contra MP (si no, redirige). |
| `/cuenta` | **Cuenta** | Login / registro con **correo+contraseña** y **Google**; panel con accesos. |
| `/cuenta/pedidos` | **Pedidos** | Historial real del usuario (RLS). |
| `/wishlist` | **Favoritos** | Lista de deseos (corazón en cada tarjeta). |
| `/nosotros`, `/contacto` | Marca | Historia y contacto. |
| `/admin` | **Admin** | Panel con KPIs, pedidos e inventario bajo. |

Extras globales: **verificación de edad +18** (modal, una vez), **botón flotante de
WhatsApp** (+57 313 4313851), header pegajoso, menú móvil, buscador instantáneo y drawer
de carrito.

---

## 🧱 Arquitectura

- **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind + Framer Motion + Lottie.**
- **Supabase** — Postgres (catálogo, pedidos, perfiles, favoritos), **Auth**
  (correo+contraseña y Google OAuth) y **Storage** (fotos). Lecturas públicas del catálogo
  con la _anon key_ + **RLS**; datos de usuario aislados por RLS.
- **Pagos — Mercado Pago** en **Supabase Edge Functions** (Deno):
  - `create-checkout` — recomputa precios y envío en el servidor (nunca confía en el
    cliente), registra el pedido `pendiente` y crea la preferencia de MP.
  - `mp-webhook` — verifica el pago contra la API de MP (+ firma opcional) y marca el
    pedido `pagado`.
  - El storefront llama a la función y **cae al route de Next.js** (`/api/checkout`) como
    respaldo, así el pago nunca se bloquea.
- **Localización** — `formatCOP` (Intl `es-CO`), envío por zona en `src/data/colombia.ts`.

```
src/
├─ app/                    # rutas (Inicio, Tienda, Producto, Carrito, Checkout, Cuenta, Admin, API)
├─ components/             # brand · intro · layout · ui · product · cart · sections · auth
├─ lib/                    # catalog (Supabase) · supabase (client/server/admin/public) · mercadopago · format · motion
├─ store/                  # zustand: cart · wishlist · intro
├─ data/                   # categorías, colombia (envío), testimonios
└─ types/                  # interfaces de dominio
supabase/functions/        # create-checkout · mp-webhook (Edge Functions)
docs/                      # DESIGN-SYSTEM.md · ARCHITECTURE.md
```

---

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env.local     # completa las claves
npm run dev                    # http://localhost:3000
```

`.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon/publishable key>"   # público — RLS protege los datos
SUPABASE_SERVICE_ROLE_KEY="<service role>"               # server-only (pedidos)
MERCADOPAGO_MODE="test"                                   # test | prod
MP_ACCESS_TOKEN_TEST="APP_USR-..."                        # (fallback Next.js)
NEXT_PUBLIC_SITE_URL="https://www.luvoraoficial.com"
```

> El token de Mercado Pago para las Edge Functions se guarda como **secreto en Supabase**
> (`MP_ACCESS_TOKEN`), no en el repo. Para producción, cámbialo por el token de
> _Credenciales de producción_ y pon `MERCADOPAGO_MODE=prod` en Vercel.

Scripts: `dev` · `build` · `start` · `lint` · `typecheck`.
Más detalle en [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) y [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## ✅ Estado

Catálogo, búsqueda y filtros en vivo desde Supabase · fotos en Storage · **auth
(correo+Google)** · **Mercado Pago** (Edge Functions + fallback) con pedidos e historial
real · envío por zonas en COP · intro Lottie + morph · verificación +18 · WhatsApp ·
build verde y páginas SSR OK.

<div align="center"><sub>© 2026 LUVORA — Solo para mayores de edad · Envío discreto · Empaque 100% neutro</sub></div>

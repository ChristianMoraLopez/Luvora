# LUVORA — Sistema de diseño

> Lenguaje visual: skincare de lujo aplicado al bienestar íntimo. Espacios amplios, mate, editorial, cálido y discreto. **Nada de neón, vulgaridad ni clichés de sex-shop.**

La **fuente única de verdad** de los tokens es [`src/config/tokens.ts`](../src/config/tokens.ts). Se refleja en:
- Tailwind → [`tailwind.config.ts`](../tailwind.config.ts)
- CSS variables → [`src/app/globals.css`](../src/app/globals.css)
- Motion → [`src/lib/motion.ts`](../src/lib/motion.ts)

Al cambiar un token, actualiza el archivo fuente y sus tres espejos.

---

## 1. Color

| Nombre | Hex | Tailwind | Uso |
|---|---|---|---|
| Burgundy | `#6B1E3A` | `burgundy` | Primario: hero, texto de marca, CTAs sólidos |
| Burgundy deep | `#571731` | `burgundy-deep` | Fondo del footer |
| Blush | `#D6A5B4` | `blush` | Texto de resalte (*sin tabúes*) |
| Blush soft | `#F2E5E2` | `blush-soft` | Fondos de sección alternos |
| Mauve | `#A96E7E` | `blush-mauve` / `text-mauve` | Eyebrows y texto atenuado |
| Champagne | `#E8D9C5` | `champagne` | Botón primario, rellenos |
| Oro/arena | `#D9B48C` | `champagne-gold` | Punto dorado, hover del primario |
| Ivory | `#F8F6F2` | `ivory` | Fondo de página |
| Ink | `#1F1F1F` | `ink` | Texto de cuerpo |

**Sombras:** el diseño base es plano/mate. Las sombras (`shadow-soft`, `shadow-lift`, `shadow-drawer`) se reservan para superficies interactivas (drawers, hover de tarjetas).

---

## 2. Tipografía

- **Display / títulos:** Playfair Display (400/500/600 + itálica). Clase `font-display`.
- **Cuerpo / UI:** Montserrat (300/400/500/600). Clase `font-sans`.
- Cargadas con `next/font/google` → variables `--font-playfair`, `--font-montserrat` (sin CLS, self-hosted).

Escala fluida (`clamp`, en `tailwind.config.ts`):

| Rol | Clase / valor |
|---|---|
| H1 | `text-[clamp(38px,4.6vw,62px)]` (`display-1`) |
| H2 | `text-[clamp(30px,3.4vw,42px)]` (`display-2`) |
| Cuerpo | 13–15px, `leading-[1.7–1.8]`, `font-light` |
| Eyebrow | `.eyebrow` → 11px, `600`, `tracking-[0.22em]`, mayúsculas |

Rasgos editoriales: `tracking-wordmark` (0.3em) para «LUVORA», `tracking-nav` (0.16em) en navegación, itálica de Playfair para frases de énfasis.

---

## 3. Espaciado, radios y layout

- Ancho de contenido: `max-w-content` (**1200px**), gutters fluidos `px-gutter` (`clamp(20px,4vw,48px)`).
- Padding de sección: `py-section` (`clamp(40px,5vw,104px)`).
- Radios: tarjetas/imágenes `rounded-card` (~6px), píldoras `rounded-pill`.
- Grids de producto: `repeat(auto-fill, minmax(210–230px, 1fr))`, gap `clamp(24px,3vw,36px)` → reflujan a una columna en móvil sin breakpoints fijos.

---

## 4. Componentes

**Primitivos (`components/ui/`):** `Button` (variantes `primary` champagne, `solid` burgundy, `outline`, `outlineDark`, `ghost`), `IconButton` (con badge), `Input`, `Badge`, `Drawer` (scroll-lock + ESC), `Accordion` (altura animada, ARIA), `QuantityStepper`, `Skeleton`, `Container`, `Reveal`.

**Producto (`components/product/`):** `ProductCard` (4:5, eyebrow → nombre Playfair → precio, hover `-translate-y-1`, toggle de wishlist), `ProductGrid` (+ skeleton), `ProductGallery` (imagen 4:5 + 3 miniaturas 1:1), `Filters` (checkbox cuadrado / radio circular por handoff), `Catalog`, `PurchasePanel`, `ProductImage` (placeholder de marca).

**Marca (`components/brand/`):** `Logo` (`BrandMark` corazón + punto, `Wordmark`, `BrandLockup`), `Icons` (set de line-icons extraído del handoff), `LottieWordmark`.

---

## 5. Motion

Curva house: `--ease-luxe` = `cubic-bezier(0.22, 1, 0.36, 1)` (desacelera hacia el reposo; nunca abrupto). Duraciones en `tokens.ts` (`fast .25` / `base .45` / `slow .7` / `intro .9`).

- **Entradas:** `Reveal` / `fadeUp` — fade + subida al entrar en viewport (`once`).
- **Intro de marca:** reproduce el logotipo animado propio de la marca en **Lottie** (`public/lottie/luvora-wordmark.json`, creado en Jitter — se le quitó la marca de agua y se ajustó el fondo a ivory). El JSON se carga en runtime (fuera del bundle inicial); al terminar —o con clic para saltar— se hace *cross-fade* al sitio (`AnimatePresence`). Se muestra una vez por sesión.
- **Reduced motion:** `prefers-reduced-motion` desactiva animaciones (CSS global + `useReducedMotion` en JS). La intro se omite y el contenido aparece de inmediato.

Rendimiento: se animan solo `transform` y `opacity` (compositor GPU) → objetivo 60fps.

---

## 6. Accesibilidad

- Foco visible de marca (`:focus-visible`, ring burgundy) y **skip-link** «Saltar al contenido».
- Iconos-botón con `aria-label`; toggles con `aria-pressed`; acordeón con `aria-expanded/controls`; drawers con `role="dialog"` + `aria-modal` + cierre con ESC/backdrop.
- `lang="es-CO"`, jerarquía de encabezados correcta, `alt` en imágenes reales.
- Contraste: burgundy sobre ivory/champagne cumple AA; texto atenuado se reserva para metadatos, no para contenido crítico.

/**
 * LUVORA — Design tokens (single source of truth).
 *
 * These raw values are mirrored into:
 *  - CSS custom properties → src/app/globals.css
 *  - Tailwind theme         → tailwind.config.ts
 *  - Motion variants        → src/lib/motion.ts
 *
 * Keep this file authoritative; when a token changes, propagate it to the
 * three mirrors above.
 */

export const colors = {
  burgundy: "#6B1E3A",
  burgundyDeep: "#571731",
  blush: "#D6A5B4",
  blushSoft: "#F2E5E2",
  mauve: "#A96E7E",
  champagne: "#E8D9C5",
  gold: "#D9B48C",
  ivory: "#F8F6F2",
  ink: "#1F1F1F",
} as const;

/** Elegant, calm, "luxurious" motion. Never abrupt. */
export const easing = {
  luxe: [0.22, 1, 0.36, 1] as const, // easeOutQuint — decelerate into rest
  luxeInOut: [0.65, 0, 0.35, 1] as const,
  gentle: [0.4, 0, 0.2, 1] as const,
} as const;

export const duration = {
  fast: 0.25,
  base: 0.45,
  slow: 0.7,
  intro: 0.9,
} as const;

export const radius = {
  card: 6,
  pill: 999,
} as const;

export const layout = {
  contentMaxWidth: 1200,
  headerHeight: 68,
} as const;

/** es-CO locale + Colombian Peso. */
export const locale = {
  lang: "es-CO",
  currency: "COP",
  country: "CO",
} as const;

export type BrandColor = keyof typeof colors;

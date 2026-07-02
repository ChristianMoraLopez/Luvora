/** Global site configuration & primary navigation. */

export const siteConfig = {
  name: "LUVORA",
  tagline: "Bienestar íntimo · Placer · Conexión",
  description:
    "Bienestar íntimo premium. Productos seleccionados con cuidado, envío discreto y empaque 100% neutro. Solo para mayores de edad.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es-CO",
  promoBar: "ENVÍO DISCRETO 24–72H · EMPAQUE 100% NEUTRO · PAGO SEGURO",
  ageNotice: "Solo para mayores de edad",
} as const;

export const mainNav = [
  { label: "INICIO", href: "/" },
  { label: "TIENDA", href: "/tienda" },
  { label: "NOSOTROS", href: "/nosotros" },
  { label: "CONTACTO", href: "/contacto" },
] as const;

export const footerNav = {
  tienda: {
    title: "TIENDA",
    links: [
      { label: "Juguetes", href: "/tienda?categoria=juguetes" },
      { label: "Lencería", href: "/tienda?categoria=lenceria" },
      { label: "Lubricantes", href: "/tienda?categoria=lubricantes" },
      { label: "Bienestar", href: "/tienda?categoria=bienestar" },
      { label: "Kits y regalos", href: "/tienda?categoria=kits" },
    ],
  },
  ayuda: {
    title: "AYUDA",
    links: [
      { label: "Envíos y devoluciones", href: "/ayuda/envios" },
      { label: "Preguntas frecuentes", href: "/ayuda/faq" },
      { label: "Privacidad", href: "/legal/privacidad" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
} as const;

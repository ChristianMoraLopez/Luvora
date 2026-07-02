import type { Category } from "@/types";

export const categories: Category[] = [
  {
    slug: "juguetes",
    name: "Juguetes",
    description: "Diseño de autor, silicona grado médico y motores silenciosos.",
  },
  {
    slug: "lenceria",
    name: "Lencería",
    description: "Piezas que abrazan. Encajes finos y siluetas favorecedoras.",
  },
  {
    slug: "lubricantes",
    name: "Lubricantes",
    description: "Fórmulas suaves, dermatológicamente pensadas para tu piel.",
  },
  {
    slug: "bienestar",
    name: "Bienestar",
    description: "Rituales de cuidado íntimo: velas, aceites y masaje.",
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    description: "Detalles que elevan cada momento.",
  },
  {
    slug: "kits",
    name: "Kits y regalos",
    description: "Selecciones listas para regalar — o para regalarte.",
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<Category["slug"], Category>;

export function categoryName(slug: Category["slug"]): string {
  return categoryMap[slug]?.name ?? slug;
}

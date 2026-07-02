import type { Product, Testimonial } from "@/types";

/**
 * Seed catalog — localized to Colombia (es-CO / COP).
 * Prices are in whole pesos. Product photography is not yet supplied, so
 * `images` is empty and the UI renders a branded placeholder (see
 * components/product/ProductImage). Replace with Supabase Storage URLs.
 *
 * Names/categories preserve the design-handoff copy; € placeholder prices
 * were converted to realistic COP price points for the Colombian market.
 */
export const products: Product[] = [
  {
    id: "ondule",
    slug: "ondule",
    name: "Ondule",
    category: "juguetes",
    subtitle: "Vibrador de lujo · Silicona grado médico",
    price: 289900,
    description:
      "Diseñado para acompañarte a tu ritmo. Diez modos de intensidad, superficie suave al tacto, silencioso y resistente al agua. Recargable por USB con hasta dos horas de uso continuo.",
    materials:
      "Silicona grado médico, libre de ftalatos. Resistente al agua (IPX7). Limpiar con agua tibia y jabón neutro o limpiador específico para juguetes; secar antes de guardar en su bolsa.",
    shipping:
      "Envío discreto en empaque 100% neutro, sin logotipos ni referencias al contenido. Entrega en 24–72h en las principales ciudades de Colombia.",
    images: [],
    badges: ["mas-vendido"],
    variants: [
      { id: "burdeos", label: "Burdeos", swatch: "#6B1E3A" },
      { id: "rosa", label: "Rosa", swatch: "#D6A5B4" },
      { id: "arena", label: "Arena", swatch: "#E8D9C5" },
    ],
    rating: 4.9,
    reviewCount: 214,
    stock: 32,
    featured: true,
    bestSeller: true,
  },
  {
    id: "sensacion-seda",
    slug: "sensacion-seda",
    name: "Sensación Seda",
    category: "lubricantes",
    subtitle: "Lubricante base agua · 100 ml",
    price: 59900,
    description:
      "Textura ligera y sedosa que respeta el pH íntimo. Compatible con juguetes de silicona y preservativos. Sin fragancia, sin parabenos.",
    materials:
      "Base agua. Dermatológicamente probado. Sin glicerina, parabenos ni fragancias añadidas.",
    shipping:
      "Envío discreto en empaque neutro. Entrega en 24–72h en las principales ciudades de Colombia.",
    images: [],
    rating: 4.8,
    reviewCount: 168,
    stock: 120,
    bestSeller: true,
  },
  {
    id: "velvet-noir",
    slug: "velvet-noir",
    name: "Velvet Noir",
    category: "lenceria",
    subtitle: "Conjunto de encaje · Corte francés",
    price: 189900,
    description:
      "Encaje floral de tacto suave y elástico que abraza sin marcar. Diseño favorecedor pensado para sentirte segura y hermosa.",
    materials:
      "82% poliamida, 18% elastano. Lavar a mano en agua fría, secar a la sombra.",
    shipping:
      "Envío discreto en empaque neutro. Cambios de talla sin costo dentro de Colombia.",
    images: [],
    variants: [
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
    ],
    rating: 4.7,
    reviewCount: 96,
    stock: 40,
    featured: true,
  },
  {
    id: "eter-vela-masaje",
    slug: "eter-vela-de-masaje",
    name: "Éter — Vela de masaje",
    category: "bienestar",
    subtitle: "Vela de masaje · Aceites nutritivos",
    price: 89900,
    description:
      "Enciéndela, espera unos minutos y vierte el aceite tibio sobre la piel. Aroma envolvente y textura nutritiva para un ritual compartido.",
    materials:
      "Ceras vegetales y aceites de coco y jojoba. Punto de fusión bajo, seguro sobre la piel.",
    shipping: "Envío discreto en empaque neutro. Entrega en 24–72h.",
    images: [],
    rating: 4.9,
    reviewCount: 73,
    stock: 60,
    featured: true,
  },
  {
    id: "duo-amour",
    slug: "duo-amour",
    name: "Duo Amour",
    category: "juguetes",
    subtitle: "Set para parejas · Control remoto",
    price: 159900,
    description:
      "Pensado para el juego compartido, con control remoto y modos sincronizados. Silicona suave, recargable y silencioso.",
    materials: "Silicona grado médico, libre de ftalatos. Resistente a salpicaduras.",
    shipping: "Envío discreto en empaque neutro. Entrega en 24–72h.",
    images: [],
    variants: [
      { id: "burdeos", label: "Burdeos", swatch: "#6B1E3A" },
      { id: "rosa", label: "Rosa", swatch: "#D6A5B4" },
    ],
    rating: 4.6,
    reviewCount: 51,
    stock: 24,
  },
  {
    id: "antifaz-encaje",
    slug: "antifaz-encaje",
    name: "Antifaz Encaje",
    category: "accesorios",
    subtitle: "Antifaz suave · Encaje forrado",
    price: 49900,
    description:
      "Un accesorio delicado para agregar misterio. Forro suave y ajuste cómodo con cinta elástica.",
    materials: "Encaje con forro de satén. Limpieza en seco recomendada.",
    shipping: "Envío discreto en empaque neutro. Entrega en 24–72h.",
    images: [],
    rating: 4.5,
    reviewCount: 38,
    stock: 80,
  },
  {
    id: "piedra-rosa",
    slug: "piedra-rosa",
    name: "Piedra Rosa",
    category: "bienestar",
    subtitle: "Ritual de cuidado · Cuarzo rosa",
    price: 219900,
    description:
      "Herramienta de bienestar en cuarzo rosa para masaje y autocuidado. Un objeto bello que invita a la calma.",
    materials: "Cuarzo rosa natural pulido. Lavar con agua tibia y jabón neutro.",
    shipping: "Envío discreto en empaque neutro. Entrega en 24–72h.",
    images: [],
    rating: 4.8,
    reviewCount: 44,
    stock: 18,
  },
  {
    id: "kit-descubrimiento",
    slug: "kit-descubrimiento",
    name: "Kit Descubrimiento",
    category: "kits",
    subtitle: "Selección para comenzar · 4 piezas",
    price: 329900,
    compareAtPrice: 399900,
    description:
      "Una introducción cuidada al mundo LUVORA: cuatro piezas seleccionadas para descubrir con calma. Presentado en una caja de regalo elegante.",
    materials: "Incluye juguete, lubricante base agua, vela de masaje y antifaz.",
    shipping:
      "Envío discreto en empaque neutro. La caja de regalo va dentro del empaque neutro exterior.",
    images: [],
    badges: ["regalo-ideal"],
    rating: 4.9,
    reviewCount: 129,
    stock: 22,
    featured: true,
    bestSeller: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBestSellers(limit = 4): Product[] {
  return products.filter((p) => p.bestSeller).slice(0, limit);
}

export function getFeatured(limit = 4): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getRelated(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit);
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "La experiencia de compra es tan cuidada como el producto. El empaque llegó totalmente neutro y discreto.",
    author: "Valentina R.",
    location: "Medellín",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "Calidad real y una estética preciosa. Se siente una marca en la que puedo confiar.",
    author: "Camila & Andrés",
    location: "Bogotá",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "Me encantó lo fácil y elegante que fue todo. Volveré a comprar sin duda.",
    author: "Daniela M.",
    location: "Cali",
    rating: 5,
  },
];

/**
 * LUVORA — Domain types.
 * These mirror the Supabase schema (see supabase/schema.sql) and are the
 * contract shared across data access, stores and UI.
 */

export type CategorySlug =
  | "juguetes"
  | "lenceria"
  | "lubricantes"
  | "bienestar"
  | "accesorios"
  | "kits";

export interface Category {
  slug: CategorySlug;
  /** Display label, es-CO (e.g. "Juguetes", "Lencería"). */
  name: string;
  description?: string;
  image?: string;
}

export type ProductBadge = "mas-vendido" | "regalo-ideal" | "nuevo" | "edicion-limitada";

export interface ProductVariant {
  id: string;
  /** e.g. "Burdeos", "Rosa", "Talla M". */
  label: string;
  /** Optional hex for color swatches. */
  swatch?: string;
  /** Overrides base price when set. */
  price?: number;
  stock?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Short line under the title, e.g. "Vibrador de lujo · Silicona grado médico". */
  subtitle?: string;
  /** Price in COP (integer pesos, no decimals). */
  price: number;
  /** Optional strike-through original price. */
  compareAtPrice?: number;
  description: string;
  /** Public image URLs (Supabase Storage). Card + gallery use images[0]. */
  images: string[];
  badges?: ProductBadge[];
  variants?: ProductVariant[];
  /** Materials / care copy for the product accordion. */
  materials?: string;
  shipping?: string;
  rating?: number;
  reviewCount?: number;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  createdAt?: string;
}

export interface CartItem {
  /** Unique per product+variant. */
  id: string;
  productId: string;
  slug: string;
  name: string;
  /** Display category name (es-CO), e.g. "Juguetes". */
  category: string;
  image?: string;
  price: number;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
}

/* ── Supabase catalog shapes (normalized for the UI) ── */

/** A row of `v_product_cards`, normalized for grids/cards. */
export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  price: number;
  priceMax: number | null;
  badges: string[];
  rating: number | null;
  /** Display category name, e.g. "Juguetes". */
  category: string;
  categorySlug: string;
  subcategory: string | null;
  /** Built Storage URL (or undefined → branded placeholder). */
  image?: string;
  variantCount: number;
  tags: string[];
}

export interface DbCategory {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  position?: number;
}

export interface Variant {
  id: string;
  sku: string;
  name: string;
  /** sabor | aroma | color | tamaño | modelo | tipo | genero | default */
  optionType: string;
  price: number | null;
  size: string | null;
  inStock: boolean;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string;
  price: number;
  priceMax: number | null;
  badges: string[];
  rating: number | null;
  subcategory: string | null;
  categoryName: string;
  categorySlug: string;
  attributes: Record<string, unknown> | null;
  images: { url?: string; alt: string }[];
  variants: Variant[];
}

/* ── Commerce ── */

export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "preparando"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Address {
  fullName: string;
  phone: string;
  /** Departamento (e.g. "Antioquia"). */
  department: string;
  city: string;
  addressLine: string;
  notes?: string;
}

export interface OrderLine {
  productId: string;
  name: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  createdAt: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: Address;
  paymentId?: string;
}

/* ── Account / misc ── */

export interface Profile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
}

export interface SortOption {
  value: "destacados" | "precio-asc" | "precio-desc" | "nuevos";
  label: string;
}

export interface ProductFilters {
  categories: CategorySlug[];
  priceRange?: "0-60000" | "60000-150000" | "150000-300000" | "300000+";
  sort: SortOption["value"];
  page: number;
}

import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { imageUrl } from "@/lib/images";
import type { ProductCardData, DbCategory, ProductDetail, Variant } from "@/types";

/**
 * Catalog data access — live Supabase reads (public / anon, RLS-protected).
 * All catalog surfaces (Home, Shop, Product) go through these helpers instead
 * of the old `src/data/*` mocks.
 */

export const KNOWN_BADGES = ["nuevo", "mas_vendido", "regalo_ideal", "premium"] as const;

/** UI sort value → RPC sort value. */
export type UiSort = "destacados" | "nuevos" | "precio-asc" | "precio-desc";
const SORT_MAP: Record<UiSort, string> = {
  destacados: "relevance",
  nuevos: "newest",
  "precio-asc": "price_asc",
  "precio-desc": "price_desc",
};

function mapCard(r: any): ProductCardData {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand ?? null,
    price: r.price ?? 0,
    priceMax: r.price_max ?? null,
    badges: r.badges ?? [],
    rating: r.rating ?? null,
    category: r.category ?? "",
    categorySlug: r.category_slug ?? "",
    subcategory: r.subcategory ?? null,
    image: imageUrl(r.primary_image),
    variantCount: Number(r.variant_count ?? 0),
    tags: r.tags ?? [],
  };
}

/* ── Home ─────────────────────────────────────────────── */

/** Best sellers for "Los más deseados" — badged first, then top-rated. */
export async function getBestSellers(limit = 8): Promise<ProductCardData[]> {
  const supabase = createPublicClient();

  const { data: badged } = await supabase
    .from("v_product_cards")
    .select("*")
    .overlaps("badges", KNOWN_BADGES as unknown as string[])
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);

  const rows = [...(badged ?? [])];

  if (rows.length < limit) {
    const { data: top } = await supabase
      .from("v_product_cards")
      .select("*")
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(limit * 2);
    for (const r of top ?? []) {
      if (rows.length >= limit) break;
      if (!rows.some((x) => x.id === r.id)) rows.push(r);
    }
  }

  return rows.slice(0, limit).map(mapCard);
}

/** A single hero product for the "couples / gifts" band. */
export async function getFeaturedProduct(categorySlug?: string): Promise<ProductCardData | null> {
  const supabase = createPublicClient();
  let query = supabase.from("v_product_cards").select("*").limit(1);
  if (categorySlug) query = query.eq("category_slug", categorySlug);
  const { data } = await query.order("rating", { ascending: false, nullsFirst: false });
  return data && data[0] ? mapCard(data[0]) : null;
}

export async function getCategories(): Promise<DbCategory[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("categories")
    .select("id, slug, name, description, position")
    .eq("is_active", true)
    .order("position", { ascending: true });
  return (data ?? []) as DbCategory[];
}

/* ── Shop ─────────────────────────────────────────────── */

export interface SearchParams {
  q?: string | null;
  catSlugs?: string[] | null;
  tagSlugs?: string[] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  badges?: string[] | null;
  sort?: UiSort;
}

/**
 * Full result set for the current filters via the `search_products` RPC.
 * The RPC has no total-count; with ≤235 products we fetch all matching rows
 * (lim 500) and let the caller paginate in memory — this keeps the exact
 * numbered-pagination design and exact counts, matching the RPC's FTS.
 */
export async function searchProducts(params: SearchParams): Promise<ProductCardData[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("search_products", {
    q: params.q?.trim() || null,
    cat_slugs: params.catSlugs?.length ? params.catSlugs : null,
    tag_slugs: params.tagSlugs?.length ? params.tagSlugs : null,
    min_price: params.minPrice ?? null,
    max_price: params.maxPrice ?? null,
    badges_in: params.badges?.length ? params.badges : null,
    sort: SORT_MAP[params.sort ?? "destacados"],
    lim: 500,
    off: 0,
  });
  if (error) {
    console.error("search_products error:", error.message);
    return [];
  }
  return (data ?? []).map(mapCard);
}

/* ── Product detail ───────────────────────────────────── */

function mapVariant(v: any): Variant {
  return {
    id: v.id,
    sku: v.sku,
    name: v.name,
    optionType: v.option_type ?? "default",
    price: v.price ?? null,
    size: v.size ?? null,
    inStock: v.in_stock ?? true,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*), categories(name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;

  const images = ((data.product_images ?? []) as any[])
    .slice()
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || (a.position ?? 0) - (b.position ?? 0))
    .map((img) => ({ url: imageUrl(img.path), alt: img.alt ?? data.name }));

  const variants = ((data.product_variants ?? []) as any[])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(mapVariant);

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    brand: data.brand ?? null,
    description: data.description ?? "",
    price: data.price ?? 0,
    priceMax: data.price_max ?? null,
    badges: data.badges ?? [],
    rating: data.rating ?? null,
    subcategory: data.subcategory ?? null,
    categoryName: data.categories?.name ?? "",
    categorySlug: data.categories?.slug ?? "",
    attributes: (data.attributes as Record<string, unknown>) ?? null,
    images,
    variants,
  };
}

/** Related products = same category, excluding the current one. */
export async function getRelated(categorySlug: string, excludeSlug: string, limit = 4): Promise<ProductCardData[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("v_product_cards")
    .select("*")
    .eq("category_slug", categorySlug)
    .neq("slug", excludeSlug)
    .limit(limit);
  return (data ?? []).map(mapCard);
}

/** Slugs for generateStaticParams / sitemaps. */
export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("products").select("slug").eq("is_active", true);
  return (data ?? []).map((r: any) => r.slug);
}

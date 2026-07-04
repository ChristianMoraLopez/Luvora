/**
 * Build a public URL for a product image stored in the Supabase `product-images`
 * bucket. Paths look like `products/eb1/<slug>/01.webp`.
 *
 * The bucket may be empty today — `<ProductImage>` falls back to the branded
 * placeholder and retries the real URL automatically once objects are uploaded,
 * so no code change is needed later.
 */
const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function imageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path; // already absolute
  if (!BASE) return undefined;
  return `${BASE}/storage/v1/object/public/product-images/${path}`;
}

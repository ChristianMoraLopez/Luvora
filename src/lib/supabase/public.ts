import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-less Supabase client for PUBLIC catalog reads
 * (products, categories, search). Because it doesn't touch `next/headers`
 * cookies, it never forces dynamic rendering and won't stall the build.
 *
 * Use the cookie-based client (lib/supabase/server) only for user-scoped,
 * authenticated data (cart, orders, profile).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

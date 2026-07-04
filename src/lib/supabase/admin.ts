import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — SERVER ONLY. Bypasses RLS, so use it only in
 * trusted server code (order creation at checkout, the Mercado Pago webhook).
 * Never import this into a client component.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (set in .env.local locally and in Vercel).
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function hasServiceRole() {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

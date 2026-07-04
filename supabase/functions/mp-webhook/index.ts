import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Mercado Pago payment webhook (public; MP can't send a Supabase JWT → verify_jwt=false).
// Source of truth for "paid": re-fetches the payment from MP's API and (if
// MP_WEBHOOK_SECRET is set) validates MP's x-signature. Idempotent: only
// advances orders from `pendiente`.
//
// Secrets: MP_ACCESS_TOKEN (required), MP_WEBHOOK_SECRET (optional).
// Auto-injected: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN") ?? "";
const WEBHOOK_SECRET = Deno.env.get("MP_WEBHOOK_SECRET") ?? "";

const STATUS_MAP: Record<string, string> = {
  approved: "pagado",
  rejected: "cancelado",
  cancelled: "cancelado",
  refunded: "cancelado",
  charged_back: "cancelado",
  in_process: "pendiente",
  pending: "pendiente",
};

const ok = () => new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "GET") return ok();

  const url = new URL(req.url);
  const queryId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const queryType = url.searchParams.get("type") ?? url.searchParams.get("topic");

  let body: { type?: string; data?: { id?: string | number } } | null = null;
  try { body = await req.json(); } catch { body = null; }

  const paymentId = String(body?.data?.id ?? queryId ?? "");
  const notifType = body?.type ?? queryType;
  if (!paymentId || (notifType && notifType !== "payment")) return ok();

  if (WEBHOOK_SECRET) {
    const signature = req.headers.get("x-signature") ?? "";
    const requestId = req.headers.get("x-request-id") ?? "";
    const parts: Record<string, string> = Object.fromEntries(
      signature.split(",").map((kv) => kv.split("=").map((s) => s.trim())),
    );
    const manifest = `id:${queryId};request-id:${requestId};ts:${parts.ts};`;
    const expected = await hmacHex(WEBHOOK_SECRET, manifest);
    if (!parts.v1 || expected !== parts.v1) {
      return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
  }

  if (!MP_TOKEN) return ok();

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN}` },
  });
  if (!res.ok) return ok();

  const payment = await res.json();
  const orderId: string | undefined = payment.external_reference;
  const status: string = payment.status;

  if (orderId) {
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
    const patch: Record<string, unknown> = {
      status: STATUS_MAP[status] ?? "pendiente",
      payment_ref: String(payment.id),
      payment_method: "mercadopago",
    };
    if (status === "approved") patch.paid_at = new Date().toISOString();
    await admin.from("orders").update(patch).eq("id", orderId).eq("status", "pendiente");
  }

  return ok();
});

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getMercadoPagoConfig } from "@/lib/mercadopago";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

/**
 * Mercado Pago payment webhook. This is the source of truth for "paid" — it
 * doesn't trust the notification body; it re-fetches the payment from MP's API
 * and (if MERCADOPAGO_WEBHOOK_SECRET is set) validates MP's x-signature.
 *
 * It only advances orders from `pendiente`, so it's idempotent and won't
 * clobber a manually shipped/delivered order.
 */
const STATUS_MAP: Record<string, string> = {
  approved: "pagado",
  rejected: "cancelado",
  cancelled: "cancelado",
  refunded: "cancelado",
  charged_back: "cancelado",
  in_process: "pendiente",
  pending: "pendiente",
};

export async function POST(request: Request) {
  const url = new URL(request.url);
  const queryId = url.searchParams.get("data.id") || url.searchParams.get("id");
  const queryType = url.searchParams.get("type") || url.searchParams.get("topic");

  let body: { type?: string; data?: { id?: string | number } } | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const paymentId = String(body?.data?.id ?? queryId ?? "");
  const notifType = body?.type ?? queryType;

  // Only payment notifications matter; ack everything else so MP stops retrying.
  if (!paymentId || (notifType && notifType !== "payment")) {
    return NextResponse.json({ ok: true });
  }

  // Optional MP signature validation (recommended once you set the secret).
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (secret) {
    const signature = request.headers.get("x-signature") ?? "";
    const requestId = request.headers.get("x-request-id") ?? "";
    const parts = Object.fromEntries(
      signature.split(",").map((kv) => kv.split("=").map((s) => s.trim())),
    ) as { ts?: string; v1?: string };
    const manifest = `id:${queryId};request-id:${requestId};ts:${parts.ts};`;
    const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
    if (!parts.v1 || expected !== parts.v1) {
      console.warn("MP webhook: signature mismatch");
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const { accessToken } = getMercadoPagoConfig();
  if (!accessToken || !hasServiceRole()) {
    return NextResponse.json({ ok: true }); // nothing we can do; ack
  }

  // Authoritative lookup.
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return NextResponse.json({ ok: true }); // unknown id → ack

  const payment = await res.json();
  const orderId: string | undefined = payment.external_reference;
  const status: string = payment.status;

  if (orderId) {
    const admin = createAdminClient();
    const patch: Record<string, unknown> = {
      status: STATUS_MAP[status] ?? "pendiente",
      payment_ref: String(payment.id),
      payment_method: "mercadopago",
    };
    if (status === "approved") patch.paid_at = new Date().toISOString();
    await admin.from("orders").update(patch).eq("id", orderId).eq("status", "pendiente");
  }

  return NextResponse.json({ ok: true });
}

// MP sometimes probes the endpoint with GET.
export async function GET() {
  return NextResponse.json({ ok: true });
}

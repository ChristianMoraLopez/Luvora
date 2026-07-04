import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { getMercadoPagoConfig } from "@/lib/mercadopago";
import { ExitoView } from "./ExitoView";

export const metadata: Metadata = { title: "Compra confirmada", robots: { index: false } };
export const dynamic = "force-dynamic";

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Post-payment confirmation. Guarded: it must reference a REAL order and a
 * verified/approved payment — otherwise (random or spoofed visit) it redirects
 * home. Only then does the client clear the cart.
 */
export default async function CheckoutExitoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const orderNumber = first(sp.order);
  const paymentId = first(sp.payment_id) ?? first(sp.collection_id);

  // No order reference (or no way to verify) → this isn't a real confirmation.
  if (!orderNumber || !hasServiceRole()) redirect("/");

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, order_number, status, total")
    .eq("order_number", orderNumber)
    .maybeSingle();

  // Unknown order number → nothing to confirm.
  if (!order) redirect("/");

  // Paid if the webhook already flagged it, or the redirect's payment verifies
  // as approved for THIS order (payment_id is checked against MP — the `status`
  // query param alone is not trusted, since the URL can be edited).
  let paid = order.status === "pagado";
  if (!paid && paymentId) {
    const { accessToken } = getMercadoPagoConfig();
    if (accessToken) {
      try {
        const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const p = await res.json();
          paid = p.status === "approved" && p.external_reference === order.id;
        }
      } catch {
        /* ignore — treat as not-yet-confirmed */
      }
    }
  }

  return <ExitoView orderNumber={order.order_number} total={order.total} paid={paid} />;
}

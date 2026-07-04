import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Checkout Edge Function: recomputes prices + shipping from the DB (client
// values never trusted), records a "pendiente" order (service role), then
// creates a Mercado Pago preference tied to it. The mp-webhook function flips
// the order to "pagado" on approval.
//
// Secrets (Project Settings -> Edge Functions -> Secrets):
//   MP_ACCESS_TOKEN  (required)   -- Mercado Pago access token
//   SITE_URL         (optional)   -- defaults to https://www.luvoraoficial.com
// Auto-injected: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.

const SUPABASE_URL = (Deno.env.get("SUPABASE_URL") ?? "").trim();
const SERVICE_KEY = (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "").trim();
const ANON_KEY = (Deno.env.get("SUPABASE_ANON_KEY") ?? "").trim();
// Strip stray non-printable chars — a trailing newline in the secret makes the
// Authorization header an invalid ByteString.
const MP_TOKEN = (Deno.env.get("MP_ACCESS_TOKEN") ?? "").replace(/[^\x20-\x7E]/g, "").trim();
const SITE_URL = (Deno.env.get("SITE_URL") ?? "https://www.luvoraoficial.com").trim();

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

const NATIONAL = 18000;
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").trim();
const METRO = ["bello", "envigado", "itagui", "san cristobal"];
const Z13 = ["sabaneta", "san antonio de prado"];
const NEAR = ["caldas", "copacabana", "girardota", "rionegro", "san jeronimo"];
function shippingCost(dep?: string, city?: string): number {
  if (!dep) return NATIONAL;
  const d = norm(dep);
  const c = norm(city ?? "");
  if (!d.includes("antioquia")) return NATIONAL;
  if (!c) return NATIONAL;
  if (c.includes("medellin")) return 11000;
  if (METRO.some((x) => c.includes(x))) return 12000;
  if (Z13.some((x) => c.includes(x))) return 13000;
  if (NEAR.some((x) => c.includes(x))) return 10000;
  return 15000;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    if (!MP_TOKEN) return json({ message: "Configura MP_ACCESS_TOKEN en los secretos de la funcion." });

    const { items, form = {} } = await req.json();
    if (!Array.isArray(items) || items.length === 0) return json({ message: "El carrito esta vacio." }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    let userId: string | null = null;
    const auth = (req.headers.get("Authorization") ?? "").trim();
    if (auth && auth !== `Bearer ${ANON_KEY}`) {
      const uc = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: auth } },
        auth: { persistSession: false },
      });
      const { data } = await uc.auth.getUser();
      userId = data.user?.id ?? null;
    }

    const variantIds = [...new Set(items.filter((i: any) => i.variantId).map((i: any) => i.variantId))];
    const productIds = [...new Set(items.filter((i: any) => !i.variantId).map((i: any) => i.productId))];
    const vmap = new Map<string, { price: number | null; sku: string | null }>();
    const pmap = new Map<string, { price: number | null; sku: string | null }>();
    if (variantIds.length) {
      const { data } = await admin.from("product_variants").select("id, price, sku").in("id", variantIds);
      for (const v of data ?? []) vmap.set(v.id, { price: v.price, sku: v.sku });
    }
    if (productIds.length) {
      const { data } = await admin.from("products").select("id, price, sku_primary").in("id", productIds);
      for (const p of data ?? []) pmap.set(p.id, { price: p.price, sku: p.sku_primary });
    }

    const lines = items.map((i: any) => {
      const v = i.variantId ? vmap.get(i.variantId) : null;
      const p = pmap.get(i.productId);
      const unit = v?.price ?? p?.price ?? i.price;
      const sku = v?.sku ?? p?.sku ?? i.productId;
      return {
        productId: i.productId,
        variantId: i.variantId ?? null,
        sku,
        productName: i.name,
        variantName: i.variantLabel ?? null,
        unitPrice: unit,
        quantity: i.quantity,
        lineTotal: unit * i.quantity,
      };
    });

    const subtotal = lines.reduce((s: number, l: any) => s + l.lineTotal, 0);
    const ship = shippingCost(form.department, form.city);
    const total = subtotal + ship;

    const { data: order, error } = await admin
      .from("orders")
      .insert({
        user_id: userId,
        guest_email: userId ? null : form.email || null,
        status: "pendiente",
        currency: "COP",
        subtotal,
        shipping_cost: ship,
        total,
        shipping_address: {
          full_name: form.fullName ?? null,
          email: form.email ?? null,
          phone: form.phone ?? null,
          department: form.department ?? null,
          city: form.city ?? null,
          address_line: form.addressLine ?? null,
          notes: form.notes ?? null,
        },
        payment_method: "mercadopago",
        customer_notes: form.notes || null,
      })
      .select("id, order_number")
      .single();
    if (error || !order) return json({ message: "No fue posible registrar el pedido." }, 500);

    await admin.from("order_items").insert(
      lines.map((l: any) => ({
        order_id: order.id,
        product_id: l.productId,
        variant_id: l.variantId,
        sku: l.sku,
        product_name: l.productName,
        variant_name: l.variantName,
        unit_price: l.unitPrice,
        quantity: l.quantity,
        line_total: l.lineTotal,
      })),
    );

    const isHttps = SITE_URL.startsWith("https://");
    const preference: Record<string, unknown> = {
      items: lines.map((l: any) => ({
        id: l.productId,
        title: l.variantName ? `${l.productName} - ${l.variantName}` : l.productName,
        quantity: l.quantity,
        unit_price: l.unitPrice,
        currency_id: "COP",
      })),
      shipments: { cost: ship, mode: "not_specified" },
      external_reference: order.id,
      back_urls: {
        success: `${SITE_URL}/checkout/exito?order=${order.order_number}`,
        failure: `${SITE_URL}/checkout?estado=fallido`,
        pending: `${SITE_URL}/checkout/pendiente`,
      },
      binary_mode: true,
      statement_descriptor: "LUVORA",
      notification_url: `${SUPABASE_URL}/functions/v1/mp-webhook`,
    };
    if (form.email) preference.payer = { email: form.email };
    if (isHttps) preference.auto_return = "approved";

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + MP_TOKEN },
      body: JSON.stringify(preference),
    });
    if (!mpRes.ok) {
      console.error("MP preference error:", await mpRes.text());
      return json({ message: "Mercado Pago rechazo la preferencia de pago." }, 502);
    }
    const mp = await mpRes.json();
    return json({ init_point: mp.init_point, id: mp.id, order_number: order.order_number });
  } catch (e) {
    return json({ message: "Error interno: " + ((e as Error)?.message ?? String(e)) }, 500);
  }
});

import { NextResponse } from "next/server";
import type { CartItem } from "@/types";
import { siteConfig } from "@/config/site";
import { shippingCostFor } from "@/data/colombia";
import { getMercadoPagoConfig } from "@/lib/mercadopago";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * Checkout: persists a "pendiente" order (+ items) with authoritative prices,
 * then creates a Mercado Pago preference tied to it via external_reference.
 * The /api/webhooks/mercadopago handler flips the order to "pagado" on approval.
 *
 * Prices/shipping are recomputed server-side — client values are never trusted.
 */
export async function POST(request: Request) {
  const { accessToken, mode, configured } = getMercadoPagoConfig();

  let items: CartItem[] = [];
  let form: Record<string, string> = {};
  try {
    const body = await request.json();
    items = Array.isArray(body.items) ? body.items : [];
    form = body.form && typeof body.form === "object" ? body.form : {};
  } catch {
    return NextResponse.json({ message: "Cuerpo inválido." }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ message: "El carrito está vacío." }, { status: 400 });
  }
  if (!configured || !accessToken) {
    return NextResponse.json({
      message: `Mercado Pago no está configurado para el modo "${mode}". Añade las credenciales en .env.local.`,
    });
  }

  const admin = hasServiceRole() ? createAdminClient() : null;
  if (!admin) {
    return NextResponse.json(
      { message: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor para registrar el pedido." },
      { status: 500 },
    );
  }

  // Who is buying (optional session).
  let userId: string | null = null;
  try {
    const supabaseUser = await createServerClient();
    const { data } = await supabaseUser.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    userId = null;
  }

  // ── Authoritative prices + SKUs from the DB ──
  const variantIds = [...new Set(items.map((i) => i.variantId).filter(Boolean) as string[])];
  const productIds = [...new Set(items.filter((i) => !i.variantId).map((i) => i.productId))];

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

  const lines = items.map((i) => {
    const v = i.variantId ? vmap.get(i.variantId) : undefined;
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

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = shippingCostFor(form.department, form.city);
  const total = subtotal + shipping;

  // ── Persist the order (pendiente) ──
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      guest_email: userId ? null : form.email || null,
      status: "pendiente",
      currency: "COP",
      subtotal,
      shipping_cost: shipping,
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

  if (orderErr || !order) {
    console.error("order insert error:", orderErr?.message);
    return NextResponse.json({ message: "No fue posible registrar el pedido." }, { status: 500 });
  }

  const { error: itemsErr } = await admin.from("order_items").insert(
    lines.map((l) => ({
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
  if (itemsErr) console.error("order_items insert error:", itemsErr.message);

  // ── Mercado Pago preference ──
  const isHttps = siteConfig.url.startsWith("https://");
  const preference = {
    items: lines.map((l) => ({
      id: l.productId,
      title: l.variantName ? `${l.productName} — ${l.variantName}` : l.productName,
      quantity: l.quantity,
      unit_price: l.unitPrice,
      currency_id: "COP",
    })),
    payer: form.email ? { email: form.email } : undefined,
    shipments: { cost: shipping, mode: "not_specified" },
    external_reference: order.id,
    back_urls: {
      success: `${siteConfig.url}/checkout/exito?order=${order.order_number}`,
      failure: `${siteConfig.url}/checkout?estado=fallido`,
      pending: `${siteConfig.url}/checkout/pendiente?order=${order.order_number}`,
    },
    ...(isHttps ? { auto_return: "approved" } : {}),
    binary_mode: true,
    statement_descriptor: "LUVORA",
    notification_url: `${siteConfig.url}/api/webhooks/mercadopago`,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(preference),
  });

  if (!res.ok) {
    console.error("Mercado Pago preference error:", res.status, await res.text());
    return NextResponse.json({ message: "Mercado Pago rechazó la preferencia de pago." }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({
    init_point: data.init_point,
    id: data.id,
    order_number: order.order_number,
    mode,
  });
}

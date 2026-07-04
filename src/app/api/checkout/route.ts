import { NextResponse } from "next/server";
import type { CartItem } from "@/types";
import { siteConfig } from "@/config/site";
import { shippingCostFor } from "@/data/colombia";
import { getMercadoPagoConfig } from "@/lib/mercadopago";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Creates a Mercado Pago Checkout Pro preference and returns its `init_point`.
 *
 * Credentials come from getMercadoPagoConfig() (MERCADOPAGO_MODE = test | prod).
 * Prices are recomputed from the DB — client-sent prices are never trusted.
 *
 * Remaining for production:
 *  - Persist a "pendiente" order and pass its id as external_reference.
 *  - Verify payment via /api/webhooks/mercadopago before fulfilling.
 */
export async function POST(request: Request) {
  const { accessToken, mode, configured } = getMercadoPagoConfig();

  let items: CartItem[] = [];
  let department: string | undefined;
  let city: string | undefined;
  try {
    const body = await request.json();
    items = Array.isArray(body.items) ? body.items : [];
    department = typeof body.department === "string" ? body.department : undefined;
    city = typeof body.city === "string" ? body.city : undefined;
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

  // ── Recompute authoritative unit prices from the DB ──
  const supabase = createPublicClient();
  const variantIds = [...new Set(items.map((i) => i.variantId).filter(Boolean) as string[])];
  const productIds = [...new Set(items.filter((i) => !i.variantId).map((i) => i.productId))];

  const priceByVariant = new Map<string, number>();
  const priceByProduct = new Map<string, number>();

  if (variantIds.length) {
    const { data } = await supabase.from("product_variants").select("id, price").in("id", variantIds);
    for (const v of data ?? []) if (v.price != null) priceByVariant.set(v.id, v.price);
  }
  if (productIds.length) {
    const { data } = await supabase.from("products").select("id, price").in("id", productIds);
    for (const p of data ?? []) if (p.price != null) priceByProduct.set(p.id, p.price);
  }

  const lineItems = items.map((i) => {
    const unit = i.variantId
      ? priceByVariant.get(i.variantId) ?? priceByProduct.get(i.productId) ?? i.price
      : priceByProduct.get(i.productId) ?? i.price;
    return {
      id: i.productId,
      title: i.variantLabel ? `${i.name} — ${i.variantLabel}` : i.name,
      quantity: i.quantity,
      unit_price: unit,
      currency_id: "COP",
    };
  });

  const shipping = shippingCostFor(department, city);

  // Mercado Pago only accepts `auto_return` with a valid public (https) URL.
  // Locally (http://localhost) we omit it so the sandbox flow still works.
  const isHttps = siteConfig.url.startsWith("https://");

  const preference = {
    items: lineItems,
    shipments: { cost: shipping, mode: "not_specified" },
    back_urls: {
      success: `${siteConfig.url}/checkout/exito`,
      failure: `${siteConfig.url}/checkout`,
      pending: `${siteConfig.url}/checkout/pendiente`,
    },
    ...(isHttps ? { auto_return: "approved" } : {}),
    statement_descriptor: "LUVORA",
    notification_url: `${siteConfig.url}/api/webhooks/mercadopago`,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Mercado Pago preference error:", res.status, detail);
    return NextResponse.json(
      { message: "Mercado Pago rechazó la preferencia de pago." },
      { status: 502 },
    );
  }

  const data = await res.json();
  return NextResponse.json({ init_point: data.init_point, id: data.id, mode });
}

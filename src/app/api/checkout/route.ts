import { NextResponse } from "next/server";
import type { CartItem } from "@/types";
import { siteConfig } from "@/config/site";
import { shippingFor } from "@/data/colombia";

/**
 * Creates a Mercado Pago Checkout Pro preference and returns its `init_point`.
 *
 * Requires MERCADOPAGO_ACCESS_TOKEN (server-only). Without it we respond 200
 * with a helpful message so the checkout UI degrades gracefully in dev.
 *
 * Production hardening TODO:
 *  - Recompute prices from the DB (never trust client-sent prices).
 *  - Persist a "pendiente" order, pass its id as external_reference.
 *  - Verify payment via the /api/webhooks/mercadopago handler before fulfilling.
 */
export async function POST(request: Request) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  let items: CartItem[] = [];
  try {
    const body = await request.json();
    items = Array.isArray(body.items) ? body.items : [];
  } catch {
    return NextResponse.json({ message: "Cuerpo inválido." }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ message: "El carrito está vacío." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({
      message:
        "Mercado Pago no está configurado. Añade MERCADOPAGO_ACCESS_TOKEN en .env.local para habilitar el pago.",
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = shippingFor(subtotal);

  const preference = {
    items: items.map((i) => ({
      id: i.productId,
      title: i.variantLabel ? `${i.name} — ${i.variantLabel}` : i.name,
      quantity: i.quantity,
      unit_price: i.price,
      currency_id: "COP",
    })),
    shipments: { cost: shipping, mode: "not_specified" },
    back_urls: {
      success: `${siteConfig.url}/checkout/exito`,
      failure: `${siteConfig.url}/checkout`,
      pending: `${siteConfig.url}/checkout/pendiente`,
    },
    auto_return: "approved",
    statement_descriptor: "LUVORA",
    notification_url: `${siteConfig.url}/api/webhooks/mercadopago`,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preference),
  });

  if (!res.ok) {
    return NextResponse.json(
      { message: "Mercado Pago rechazó la preferencia de pago." },
      { status: 502 },
    );
  }

  const data = await res.json();
  return NextResponse.json({ init_point: data.init_point, id: data.id });
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductImage } from "@/components/product/ProductImage";
import { ShieldIcon, PackageIcon, TruckIcon } from "@/components/brand/Icons";
import { useCartStore, selectSubtotal } from "@/store/cart";
import { formatCOP } from "@/lib/format";
import { departamentos, shippingQuote, shippingRates } from "@/data/colombia";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);

  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live shipping quote from the chosen location.
  const quote = shippingQuote(department, city);
  const shipping = quote?.cost ?? 0;
  const total = subtotal + shipping;

  const pay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Capture form values synchronously (before any await nulls currentTarget).
    const fd = new FormData(e.currentTarget);
    const form = {
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      department: String(fd.get("department") ?? department),
      city: String(fd.get("city") ?? city),
      addressLine: String(fd.get("addressLine") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    setSubmitting(true);
    setError(null);
    try {
      // Server persists the order + recomputes prices AND shipping → MP total.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, form }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError(data.message ?? "No fue posible iniciar el pago. Configura Mercado Pago.");
      }
    } catch {
      setError("Ocurrió un error al procesar el pago.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center gap-5 py-28 text-center">
        <h1 className="font-display text-3xl">No hay nada por pagar</h1>
        <Button href="/tienda" variant="solid" size="md">
          Explorar tienda
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-[clamp(32px,5vw,64px)]">
      <nav className="mb-8 text-[11px] uppercase tracking-nav text-mauve">
        <Link href="/carrito" className="hover:text-burgundy">Carrito</Link> /{" "}
        <span className="text-burgundy">Pago</span>
      </nav>
      <h1 className="mb-10 font-display text-[clamp(30px,4vw,48px)]">Finalizar compra</h1>

      <form onSubmit={pay} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Contact + shipping */}
        <div className="flex flex-col gap-8">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 font-display text-2xl">Contacto</legend>
            <Input label="Nombre completo" name="fullName" required autoComplete="name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Correo electrónico" name="email" type="email" required autoComplete="email" />
              <Input label="Teléfono (WhatsApp)" name="phone" type="tel" required autoComplete="tel" />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 font-display text-2xl">Envío</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="dep" className="eyebrow text-mauve">Departamento</label>
                <select
                  id="dep"
                  name="department"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-sm border border-burgundy/15 bg-white/60 px-4 py-3 text-[14px] focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                >
                  <option value="" disabled>Selecciona…</option>
                  {departamentos.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Ciudad / Municipio"
                name="city"
                required
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <Input label="Dirección" name="addressLine" required autoComplete="street-address" />
            <Input label="Indicaciones (opcional)" name="notes" hint="Apto, torre, referencia para la entrega." />
          </fieldset>

          <div className="flex items-center gap-3 rounded-card bg-blush-soft px-5 py-4 text-[13px] text-burgundy">
            <PackageIcon size={22} />
            Empaque 100% neutro, sin logotipos ni referencias al contenido.
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-card border border-border bg-white/50 p-7 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Tu pedido</h2>
          <ul className="mt-5 flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 shrink-0">
                  <ProductImage src={item.image} alt={item.name} label={item.name} className="rounded-sm" />
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-burgundy px-1 text-[10px] text-ivory">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 text-[13px]">
                  <p className="font-medium leading-tight">{item.name}</p>
                  {item.variantLabel && <p className="text-ink/55">{item.variantLabel}</p>}
                </div>
                <span className="text-[13px] font-semibold text-burgundy">
                  {formatCOP(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 flex flex-col gap-2.5 border-t border-border pt-5 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink/70">Subtotal</dt>
              <dd>{formatCOP(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/70">
                Envío
                {quote && <span className="block text-[11px] text-mauve">{quote.zone}</span>}
              </dt>
              <dd className="text-right">
                {quote ? formatCOP(quote.cost) : <span className="text-[12px] font-light text-mauve">Se calcula con tu ciudad</span>}
              </dd>
            </div>
          </dl>
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-[13px] uppercase tracking-nav">Total</span>
            <span className="font-display text-2xl text-burgundy">{formatCOP(total)}</span>
          </div>
          {!quote && (
            <p className="mt-1 text-[11px] font-light text-ink/55">El envío se suma al elegir tu ciudad.</p>
          )}

          {/* Rates disclosure */}
          <details className="mt-5 border-t border-border pt-4 text-[13px]">
            <summary className="flex cursor-pointer items-center gap-2 text-burgundy">
              <TruckIcon size={18} /> Tarifas de envío
            </summary>
            <ul className="mt-3 flex flex-col gap-1.5 text-ink/70">
              {shippingRates.map((r) => (
                <li key={r.zone} className="flex justify-between gap-4">
                  <span>{r.zone}</span>
                  <span className="whitespace-nowrap font-medium text-ink">{r.price}</span>
                </li>
              ))}
            </ul>
          </details>

          {error && <p className="mt-4 text-[13px] text-red-500">{error}</p>}

          <Button type="submit" variant="solid" size="lg" fullWidth disabled={submitting} className="mt-6">
            {submitting ? "Redirigiendo…" : "Pagar con Mercado Pago"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-2 text-[11.5px] font-light text-ink/55">
            <ShieldIcon size={16} /> Pago seguro procesado por Mercado Pago.
          </p>
        </aside>
      </form>
    </Container>
  );
}

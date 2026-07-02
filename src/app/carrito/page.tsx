"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductImage } from "@/components/product/ProductImage";
import { BagIcon } from "@/components/brand/Icons";
import { useCartStore, selectSubtotal, selectCount } from "@/store/cart";
import { categoryName } from "@/data/categories";
import { formatCOP } from "@/lib/format";

export default function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore(selectSubtotal);
  const count = useCartStore(selectCount);

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center gap-5 py-28 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-blush-soft text-burgundy">
          <BagIcon size={30} />
        </span>
        <h1 className="font-display text-3xl">Tu carrito está vacío</h1>
        <p className="max-w-[36ch] text-[14px] font-light text-ink/70">
          Aún no has agregado productos. Descubre piezas seleccionadas con cuidado para tu bienestar íntimo.
        </p>
        <Button href="/tienda" variant="solid" size="md" className="mt-2">
          Explorar tienda
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-[clamp(32px,5vw,64px)]">
      <h1 className="mb-10 font-display text-[clamp(30px,4vw,48px)]">
        Tu carrito <span className="text-mauve">({count})</span>
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <Link href={`/producto/${item.slug}`} className="w-24 shrink-0 sm:w-28">
                <ProductImage src={item.image} alt={item.name} label={item.name} />
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow text-mauve">{categoryName(item.category)}</p>
                    <Link href={`/producto/${item.slug}`} className="font-display text-xl hover:text-burgundy">
                      {item.name}
                    </Link>
                    {item.variantLabel && <p className="text-[13px] text-ink/60">{item.variantLabel}</p>}
                  </div>
                  <span className="font-display text-lg text-burgundy">
                    {formatCOP(item.price * item.quantity)}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <QuantityStepper value={item.quantity} onChange={(q) => setQuantity(item.id, q)} />
                  <button
                    onClick={() => remove(item.id)}
                    className="text-[11px] uppercase tracking-nav text-mauve hover:text-burgundy"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-card border border-border bg-white/50 p-7 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Resumen</h2>
          <dl className="mt-5 flex flex-col gap-3 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink/70">Subtotal</dt>
              <dd className="font-medium">{formatCOP(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">Envío</dt>
              <dd className="font-light text-ink/60">Calculado al pagar</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="text-[13px] uppercase tracking-nav text-ink/70">Total</span>
            <span className="font-display text-2xl text-burgundy">{formatCOP(subtotal)}</span>
          </div>
          <Button href="/checkout" variant="solid" size="md" fullWidth className="mt-6">
            Finalizar compra
          </Button>
          <Button href="/tienda" variant="ghost" size="sm" fullWidth className="mt-2">
            Seguir comprando
          </Button>
          <p className="mt-4 text-center text-[11.5px] font-light text-ink/55">
            Envío discreto · Empaque 100% neutro · Pago seguro
          </p>
        </aside>
      </div>
    </Container>
  );
}

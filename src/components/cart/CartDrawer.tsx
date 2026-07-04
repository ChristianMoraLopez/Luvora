"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductImage } from "@/components/product/ProductImage";
import { CloseIcon, BagIcon } from "@/components/brand/Icons";
import { useCartStore, selectSubtotal, selectCount } from "@/store/cart";
import { formatCOP } from "@/lib/format";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore(selectSubtotal);
  const count = useCartStore(selectCount);

  // Close the drawer whenever the route changes (e.g. after "Ir a pagar").
  const pathname = usePathname();
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <Drawer open={isOpen} onClose={close} side="right" labelledBy="cart-title">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-[18px]">
          <h2 id="cart-title" className="font-display text-xl">
            Tu carrito {count > 0 && <span className="text-mauve">({count})</span>}
          </h2>
          <IconButton label="Cerrar carrito" onClick={close}>
            <CloseIcon size={22} />
          </IconButton>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-blush-soft text-burgundy">
              <BagIcon size={26} />
            </span>
            <p className="font-display text-xl">Tu carrito está vacío</p>
            <p className="max-w-[28ch] text-[13px] font-light text-ink/70">
              Descubre piezas seleccionadas con cuidado para tu bienestar íntimo.
            </p>
            <Button href="/tienda" variant="solid" size="md" onClick={close} className="mt-2">
              Explorar tienda
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <Link href={`/producto/${item.slug}`} onClick={close} className="w-20 shrink-0">
                    <ProductImage src={item.image} alt={item.name} label={item.name} className="rounded-sm" />
                  </Link>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="eyebrow text-mauve">{item.category}</p>
                        <Link
                          href={`/producto/${item.slug}`}
                          onClick={close}
                          className="font-display text-lg leading-tight hover:text-burgundy"
                        >
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <p className="text-[12px] text-ink/60">{item.variantLabel}</p>
                        )}
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label={`Quitar ${item.name}`}
                        className="text-[11px] uppercase tracking-nav text-mauve hover:text-burgundy"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        onChange={(q) => setQuantity(item.id, q)}
                      />
                      <span className="text-[14px] font-semibold text-burgundy">
                        {formatCOP(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[13px] uppercase tracking-nav text-ink/70">Subtotal</span>
                <span className="font-display text-xl text-burgundy">{formatCOP(subtotal)}</span>
              </div>
              <p className="mb-4 text-[12px] font-light text-ink/60">
                Envío discreto calculado al finalizar la compra.
              </p>
              <div className="flex flex-col gap-2">
                <Button href="/checkout" variant="solid" size="md" fullWidth onClick={close}>
                  Ir a pagar
                </Button>
                <Button href="/carrito" variant="outline" size="md" fullWidth onClick={close}>
                  Ver carrito
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}

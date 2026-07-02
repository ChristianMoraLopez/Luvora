"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { HeartIcon, TruckIcon, ShieldIcon, PackageIcon } from "@/components/brand/Icons";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatCOP } from "@/lib/format";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

/** Right-column purchase controls for the product detail page. */
export function PurchasePanel({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants?.[0]);
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const saved = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleSaved = useWishlistStore((s) => s.toggle);

  const price = variant?.price ?? product.price;
  const hasSwatches = product.variants?.some((v) => v.swatch);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[28px] text-burgundy">{formatCOP(price)}</span>
        {product.compareAtPrice && (
          <span className="text-[15px] font-light text-mauve line-through">
            {formatCOP(product.compareAtPrice)}
          </span>
        )}
      </div>

      <p className="max-w-prose text-[15px] font-light leading-[1.8] text-ink/75">
        {product.description}
      </p>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="eyebrow text-mauve">
            {hasSwatches ? "Color" : "Talla"} — {variant?.label}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const active = variant?.id === v.id;
              return hasSwatches ? (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  aria-label={v.label}
                  aria-pressed={active}
                  className={cn(
                    "h-9 w-9 rounded-full ring-offset-2 transition-all",
                    active ? "ring-2 ring-burgundy" : "ring-1 ring-burgundy/20 hover:ring-burgundy/50",
                  )}
                  style={{ background: v.swatch }}
                />
              ) : (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  aria-pressed={active}
                  className={cn(
                    "min-w-[44px] rounded-sm border px-3 py-2 text-[13px] transition-colors",
                    active
                      ? "border-burgundy bg-burgundy text-ivory"
                      : "border-burgundy/25 text-ink hover:border-burgundy",
                  )}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + add */}
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} />
        <Button
          variant="solid"
          size="lg"
          className="flex-1"
          onClick={() => add(product, { variant, quantity: qty })}
        >
          Añadir al carrito
        </Button>
        <button
          onClick={() => toggleSaved(product.id)}
          aria-pressed={saved}
          aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
          className={cn(
            "grid h-[52px] w-[52px] shrink-0 place-items-center rounded-sm border transition-colors",
            saved ? "border-burgundy text-burgundy" : "border-burgundy/25 text-ink hover:border-burgundy",
          )}
        >
          <HeartIcon size={20} filled={saved} />
        </button>
      </div>

      {/* Trust row */}
      <ul className="mt-2 grid grid-cols-3 gap-3 border-y border-border py-5 text-center">
        {[
          { Icon: TruckIcon, label: "Envío discreto 24–72h" },
          { Icon: PackageIcon, label: "Empaque 100% neutro" },
          { Icon: ShieldIcon, label: "Pago seguro" },
        ].map(({ Icon, label }) => (
          <li key={label} className="flex flex-col items-center gap-2">
            <Icon size={24} className="text-burgundy" />
            <span className="text-[11px] font-light leading-tight text-ink/70">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

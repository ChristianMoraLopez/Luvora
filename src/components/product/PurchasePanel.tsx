"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { HeartIcon, TruckIcon, ShieldIcon, PackageIcon } from "@/components/brand/Icons";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatCOP } from "@/lib/format";
import type { ProductDetail } from "@/types";
import { cn } from "@/lib/utils";

const OPTION_LABELS: Record<string, string> = {
  sabor: "Sabor",
  aroma: "Aroma",
  color: "Color",
  tamaño: "Tamaño",
  modelo: "Modelo",
  tipo: "Tipo",
  genero: "Género",
};

/** Right-column purchase controls for the product detail page. */
export function PurchasePanel({ product }: { product: ProductDetail }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const saved = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleSaved = useWishlistStore((s) => s.toggle);

  const hasSelector = product.variants.length > 1;
  const price = variant?.price ?? product.price;
  const optionLabel = variant ? OPTION_LABELS[variant.optionType] ?? "Opción" : "Opción";
  const outOfStock = !!variant && !variant.inStock;

  const addToCart = () => {
    if (outOfStock) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.categoryName,
        image: product.images[0]?.url,
        price,
        variantId: variant?.id,
        variantLabel: variant && variant.optionType !== "default" ? variant.name : undefined,
      },
      qty,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[28px] text-burgundy">{formatCOP(price)}</span>
      </div>

      <p className="max-w-prose text-[15px] font-light leading-[1.8] text-ink/75">
        {product.description}
      </p>

      {/* Variant selector */}
      {hasSelector && (
        <div className="flex flex-col gap-3">
          <span className="eyebrow text-mauve">
            {optionLabel} — {variant?.name}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const active = variant?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  aria-pressed={active}
                  disabled={!v.inStock}
                  className={cn(
                    "min-w-[44px] rounded-sm border px-3 py-2 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through",
                    active
                      ? "border-burgundy bg-burgundy text-ivory"
                      : "border-burgundy/25 text-ink hover:border-burgundy",
                  )}
                >
                  {v.name}
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
          onClick={addToCart}
          disabled={outOfStock}
        >
          {outOfStock ? "Agotado" : "Añadir al carrito"}
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

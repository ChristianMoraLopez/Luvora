"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ProductImage } from "./ProductImage";
import { Badge } from "@/components/ui/Badge";
import { HeartIcon } from "@/components/brand/Icons";
import { categoryName } from "@/data/categories";
import { formatCOP } from "@/lib/format";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Product card — image (4:5) → category eyebrow → name (Playfair) → price.
 * Hover lifts the card 4px (per handoff). Badge overlay + wishlist toggle.
 */
export function ProductCard({
  product,
  priority,
  index = 0,
}: {
  product: Product;
  priority?: boolean;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const saved = ids.includes(product.id);
  const badge = product.badges?.[0];

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.06 }}
      className="group relative"
    >
      <Link
        href={`/producto/${product.slug}`}
        className="flex flex-col gap-3.5 transition-transform duration-300 ease-luxe group-hover:-translate-y-1"
      >
        <div className="relative">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            label={product.name}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          />
          {badge && (
            <div className="absolute left-3 top-3">
              <Badge badge={badge} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mauve">
            {categoryName(product.category)}
          </span>
          <h3 className="font-display text-xl leading-tight text-ink">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-burgundy">
              {formatCOP(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[12px] font-light text-mauve line-through">
                {formatCOP(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-pressed={saved}
        aria-label={saved ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
        className={cn(
          "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/80 backdrop-blur transition-all duration-300 ease-luxe hover:bg-ivory",
          saved ? "text-burgundy" : "text-ink/50 hover:text-burgundy",
        )}
      >
        <HeartIcon size={18} filled={saved} />
      </button>
    </motion.article>
  );
}

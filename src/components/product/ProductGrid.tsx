import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import type { ProductCardData } from "@/types";
import { cn } from "@/lib/utils";

/** Responsive product grid — auto-fills columns down to a single column. */
export function ProductGrid({
  products,
  minColumn = 230,
  priorityCount = 0,
  className,
}: {
  products: ProductCardData[];
  minColumn?: number;
  priorityCount?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-[clamp(24px,3vw,36px)]", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${minColumn}px, 45%), 1fr))`,
      }}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, minColumn = 230 }: { count?: number; minColumn?: number }) {
  return (
    <div
      className="grid gap-[clamp(24px,3vw,36px)]"
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minColumn}px, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";

/** Shimmer placeholder. Compose to build loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-sm", className)} aria-hidden="true" />;
}

/** Product-card shaped skeleton, matching the real card's rhythm. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3.5">
      <Skeleton className="aspect-[4/5] w-full rounded-card" />
      <Skeleton className="h-2.5 w-16" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

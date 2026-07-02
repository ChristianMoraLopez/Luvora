import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/types";

const styles: Record<string, string> = {
  "mas-vendido": "bg-burgundy text-ivory",
  "regalo-ideal": "bg-champagne text-burgundy",
  nuevo: "bg-ink text-ivory",
  "edicion-limitada": "bg-blush text-burgundy",
  neutral: "bg-blush-soft text-burgundy",
};

const labels: Record<ProductBadge, string> = {
  "mas-vendido": "Más vendido",
  "regalo-ideal": "Regalo ideal",
  nuevo: "Nuevo",
  "edicion-limitada": "Edición limitada",
};

export function Badge({
  badge,
  children,
  className,
}: {
  badge?: ProductBadge;
  children?: React.ReactNode;
  className?: string;
}) {
  const key = badge ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
        styles[key],
        className,
      )}
    >
      {children ?? (badge ? labels[badge] : null)}
    </span>
  );
}

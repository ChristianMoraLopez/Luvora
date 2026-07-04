import { cn } from "@/lib/utils";

/**
 * Product badge pill. Keys are the DB badge values
 * (`nuevo`, `mas_vendido`, `regalo_ideal`, `premium`).
 */
const styles: Record<string, string> = {
  mas_vendido: "bg-burgundy text-ivory",
  regalo_ideal: "bg-champagne text-burgundy",
  nuevo: "bg-ink text-ivory",
  premium: "bg-blush text-burgundy",
  neutral: "bg-blush-soft text-burgundy",
};

const labels: Record<string, string> = {
  mas_vendido: "Más vendido",
  regalo_ideal: "Regalo ideal",
  nuevo: "Nuevo",
  premium: "Premium",
};

export function Badge({
  badge,
  children,
  className,
}: {
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const key = badge && styles[badge] ? badge : "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
        styles[key],
        className,
      )}
    >
      {children ?? (badge ? labels[badge] ?? badge : null)}
    </span>
  );
}

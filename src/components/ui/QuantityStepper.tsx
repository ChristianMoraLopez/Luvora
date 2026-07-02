"use client";

import { PlusIcon, MinusIcon } from "@/components/brand/Icons";
import { cn } from "@/lib/utils";

/** −/+ quantity control, min 1 by default. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)));

  return (
    <div
      className={cn(
        "inline-flex items-center border border-burgundy/20 rounded-sm",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Disminuir cantidad"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className={cn(dim, "grid place-items-center text-burgundy disabled:opacity-30 transition-colors hover:bg-burgundy/5")}
      >
        <MinusIcon size={16} />
      </button>
      <span
        aria-live="polite"
        className="w-9 text-center font-sans text-[14px] font-medium tabular-nums text-ink"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className={cn(dim, "grid place-items-center text-burgundy disabled:opacity-30 transition-colors hover:bg-burgundy/5")}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

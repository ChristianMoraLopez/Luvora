"use client";

import type { DbCategory } from "@/types";
import { CheckIcon } from "@/components/brand/Icons";
import { cn } from "@/lib/utils";

export interface PriceBand {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

/** COP price bands tuned to the real catalog range. */
export const PRICE_BANDS: PriceBand[] = [
  { id: "0-15000", label: "Hasta $15.000", min: 0, max: 15000 },
  { id: "15000-30000", label: "$15.000 – $30.000", min: 15000, max: 30000 },
  { id: "30000-60000", label: "$30.000 – $60.000", min: 30000, max: 60000 },
  { id: "60000-120000", label: "$60.000 – $120.000", min: 60000, max: 120000 },
  { id: "120000-", label: "Más de $120.000", min: 120000, max: null },
];

export function Filters({
  categories,
  selectedCategories,
  onToggleCategory,
  activeBand,
  onSetBand,
  onClear,
}: {
  categories: DbCategory[];
  selectedCategories: string[];
  onToggleCategory: (slug: string) => void;
  activeBand?: string;
  onSetBand: (band?: PriceBand) => void;
  onClear: () => void;
}) {
  const hasFilters = selectedCategories.length > 0 || !!activeBand;

  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="eyebrow mb-4 text-burgundy">Categoría</legend>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat.slug);
            return (
              <label key={cat.slug} className="flex cursor-pointer items-center gap-3 text-[13px] text-ink">
                <span
                  className={cn(
                    "grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[3px] border transition-colors",
                    checked ? "border-burgundy bg-burgundy text-ivory" : "border-burgundy/45",
                  )}
                >
                  {checked && <CheckIcon size={11} strokeWidth={2.4} />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onToggleCategory(cat.slug)}
                />
                {cat.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-4 text-burgundy">Precio</legend>
        <div className="flex flex-col gap-3">
          {PRICE_BANDS.map((band) => {
            const checked = activeBand === band.id;
            return (
              <label key={band.id} className="flex cursor-pointer items-center gap-3 text-[13px] text-ink">
                <span
                  className={cn(
                    "grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full border transition-colors",
                    checked ? "border-burgundy" : "border-burgundy/45",
                  )}
                >
                  {checked && <span className="h-[7px] w-[7px] rounded-full bg-burgundy" />}
                </span>
                <input
                  type="radio"
                  name="price"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onSetBand(checked ? undefined : band)}
                />
                {band.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {hasFilters && (
        <button
          onClick={onClear}
          className="self-start text-[12px] uppercase tracking-nav text-mauve underline-offset-4 hover:text-burgundy hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

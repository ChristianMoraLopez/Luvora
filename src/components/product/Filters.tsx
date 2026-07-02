"use client";

import { categories } from "@/data/categories";
import type { CategorySlug, ProductFilters } from "@/types";
import { CheckIcon } from "@/components/brand/Icons";
import { cn } from "@/lib/utils";

const priceRanges: { value: NonNullable<ProductFilters["priceRange"]>; label: string }[] = [
  { value: "0-60000", label: "Hasta $60.000" },
  { value: "60000-150000", label: "$60.000 – $150.000" },
  { value: "150000-300000", label: "$150.000 – $300.000" },
  { value: "300000+", label: "Más de $300.000" },
];

export function Filters({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onSetPrice,
  onClear,
}: {
  selectedCategories: CategorySlug[];
  onToggleCategory: (slug: CategorySlug) => void;
  priceRange?: ProductFilters["priceRange"];
  onSetPrice: (value: ProductFilters["priceRange"]) => void;
  onClear: () => void;
}) {
  const hasFilters = selectedCategories.length > 0 || !!priceRange;

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
                    "grid h-[15px] w-[15px] place-items-center rounded-[3px] border transition-colors",
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
          {priceRanges.map((range) => {
            const checked = priceRange === range.value;
            return (
              <label key={range.value} className="flex cursor-pointer items-center gap-3 text-[13px] text-ink">
                <span
                  className={cn(
                    "grid h-[15px] w-[15px] place-items-center rounded-full border transition-colors",
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
                  onChange={() => onSetPrice(checked ? undefined : range.value)}
                />
                {range.label}
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

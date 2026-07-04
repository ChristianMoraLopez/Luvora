"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Drawer } from "@/components/ui/Drawer";
import { IconButton } from "@/components/ui/IconButton";
import { Filters, PRICE_BANDS, type PriceBand } from "./Filters";
import { ProductGrid } from "./ProductGrid";
import { FilterIcon, CloseIcon, ChevronDownIcon } from "@/components/brand/Icons";
import { formatNumber } from "@/lib/format";
import type { DbCategory, ProductCardData } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sortOptions = [
  { value: "destacados", label: "Destacados" },
  { value: "nuevos", label: "Novedades" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
] as const;

/**
 * Shop view — presentational + URL-driven. All data (server-fetched via
 * `search_products`) arrives as props; every interaction updates the URL
 * (`?q=&cat=&min=&max=&sort=&page=`), which re-runs the server fetch.
 */
export function CatalogView({
  products,
  total,
  page,
  totalPages,
  categories,
  selectedCategories,
  min,
  max,
  sort,
}: {
  products: ProductCardData[];
  total: number;
  page: number;
  totalPages: number;
  categories: DbCategory[];
  selectedCategories: string[];
  min?: number;
  max?: number;
  sort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeBand = PRICE_BANDS.find(
    (b) => b.min === (min ?? -1) && (b.max ?? null) === (max ?? null),
  )?.id;

  const navigate = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const toggleCategory = (slug: string) => {
    const set = new Set(selectedCategories);
    set.has(slug) ? set.delete(slug) : set.add(slug);
    navigate({ cat: set.size ? [...set].join(",") : null, page: null });
  };

  const setBand = (band?: PriceBand) => {
    navigate({
      min: band ? String(band.min) : null,
      max: band && band.max != null ? String(band.max) : null,
      page: null,
    });
  };

  const clear = () => navigate({ cat: null, min: null, max: null, page: null });

  const filterProps = {
    categories,
    selectedCategories,
    onToggleCategory: toggleCategory,
    activeBand,
    onSetBand: setBand,
    onClear: clear,
  };

  return (
    <Container className="flex flex-col gap-8 py-[clamp(32px,5vw,64px)] lg:flex-row lg:gap-12">
      {/* Sidebar — desktop */}
      <aside className="hidden w-[220px] shrink-0 lg:block">
        <div className="sticky top-24">
          <Filters {...filterProps} />
        </div>
      </aside>

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-4">
          <p className="text-[13px] text-ink/70">
            <span className="font-semibold text-ink">{formatNumber(total)}</span>{" "}
            {total === 1 ? "producto" : "productos"}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-sm border border-burgundy/20 px-3.5 py-2 text-[12px] uppercase tracking-nav text-burgundy lg:hidden"
            >
              <FilterIcon size={16} /> Filtrar
            </button>

            <label className="relative inline-flex items-center">
              <span className="sr-only">Ordenar por</span>
              <select
                value={sort}
                onChange={(e) => navigate({ sort: e.target.value, page: null })}
                className="appearance-none rounded-sm border border-burgundy/20 bg-transparent py-2 pl-3.5 pr-9 text-[12px] uppercase tracking-nav text-ink focus:border-burgundy focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon size={16} className="pointer-events-none absolute right-2.5 text-burgundy" />
            </label>
          </div>
        </div>

        {/* Grid / empty state */}
        <div className={cn("transition-opacity duration-300", isPending && "opacity-50")}>
          {products.length > 0 ? (
            <ProductGrid products={products} minColumn={210} />
          ) : (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <p className="font-display text-2xl">No hay productos con estos filtros</p>
              <button onClick={clear} className="text-[13px] uppercase tracking-nav text-burgundy underline underline-offset-4">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  onClick={() => navigate({ page: n === 1 ? null : String(n) })}
                  aria-current={page === n}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-sm border text-[13px] transition-colors",
                    page === n
                      ? "border-burgundy bg-burgundy text-ivory"
                      : "border-burgundy/25 text-ink hover:border-burgundy",
                  )}
                >
                  {n}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Sidebar — mobile drawer */}
      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} side="left" className="max-w-[320px]">
        <div className="flex items-center justify-between border-b border-border px-6 py-[18px]">
          <span className="font-display text-xl">Filtros</span>
          <IconButton label="Cerrar filtros" onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon size={22} />
          </IconButton>
        </div>
        <div className="p-6">
          <Filters {...filterProps} />
        </div>
      </Drawer>
    </Container>
  );
}

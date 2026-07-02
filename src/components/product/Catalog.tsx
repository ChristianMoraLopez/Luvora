"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Drawer } from "@/components/ui/Drawer";
import { IconButton } from "@/components/ui/IconButton";
import { Filters } from "./Filters";
import { ProductGrid } from "./ProductGrid";
import { FilterIcon, CloseIcon, ChevronDownIcon } from "@/components/brand/Icons";
import { products as allProducts } from "@/data/products";
import { formatNumber } from "@/lib/format";
import type { CategorySlug, ProductFilters, SortOption } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

const sortOptions: SortOption[] = [
  { value: "destacados", label: "Destacados" },
  { value: "nuevos", label: "Novedades" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

const priceBounds: Record<NonNullable<ProductFilters["priceRange"]>, [number, number]> = {
  "0-60000": [0, 60000],
  "60000-150000": [60000, 150000],
  "150000-300000": [150000, 300000],
  "300000+": [300000, Infinity],
};

export function Catalog() {
  const params = useSearchParams();
  const initialCategory = params.get("categoria") as CategorySlug | null;

  const [selectedCategories, setSelectedCategories] = useState<CategorySlug[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [priceRange, setPriceRange] = useState<ProductFilters["priceRange"]>();
  const [sort, setSort] = useState<SortOption["value"]>("destacados");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }
    if (priceRange) {
      const [min, max] = priceBounds[priceRange];
      list = list.filter((p) => p.price >= min && p.price < max);
    }

    switch (sort) {
      case "precio-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "nuevos":
        list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
        break;
      default:
        list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
    }
    return list;
  }, [selectedCategories, priceRange, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const toggleCategory = (slug: CategorySlug) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };
  const setPrice = (value: ProductFilters["priceRange"]) => {
    setPage(1);
    setPriceRange(value);
  };
  const clear = () => {
    setSelectedCategories([]);
    setPriceRange(undefined);
    setPage(1);
  };

  const filterProps = {
    selectedCategories,
    onToggleCategory: toggleCategory,
    priceRange,
    onSetPrice: setPrice,
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
            <span className="font-semibold text-ink">{formatNumber(filtered.length)}</span>{" "}
            {filtered.length === 1 ? "producto" : "productos"}
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
                onChange={(e) => setSort(e.target.value as SortOption["value"])}
                className="appearance-none rounded-sm border border-burgundy/20 bg-transparent py-2 pl-3.5 pr-9 text-[12px] uppercase tracking-nav text-ink focus:border-burgundy focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                size={16}
                className="pointer-events-none absolute right-2.5 text-burgundy"
              />
            </label>
          </div>
        </div>

        {/* Grid / empty state */}
        {paged.length > 0 ? (
          <ProductGrid products={paged} minColumn={210} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-display text-2xl">No hay productos con estos filtros</p>
            <button onClick={clear} className="text-[13px] uppercase tracking-nav text-burgundy underline underline-offset-4">
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginación">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={current === n}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-sm border text-[13px] transition-colors",
                    current === n
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

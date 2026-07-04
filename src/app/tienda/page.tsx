import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CatalogView } from "@/components/product/Catalog";
import { searchProducts, getCategories, type UiSort } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "La tienda",
  description:
    "Explora el catálogo LUVORA: lubricantes, cosmética íntima, juguetes, bienestar, lencería y más. Envío discreto en toda Colombia.",
};

// Driven by URL search params → always rendered on demand.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;
const SORTS: UiSort[] = ["destacados", "nuevos", "precio-asc", "precio-desc"];

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}
function toInt(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const q = first(sp.q) ?? "";
  const cat = (first(sp.cat) ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const min = toInt(first(sp.min));
  const max = toInt(first(sp.max));
  const sortRaw = first(sp.sort) as UiSort | undefined;
  const sort: UiSort = sortRaw && SORTS.includes(sortRaw) ? sortRaw : "destacados";
  const pageReq = Math.max(1, toInt(first(sp.page)) ?? 1);

  const all = await searchProducts({
    q,
    catSlugs: cat,
    minPrice: min,
    maxPrice: max,
    sort,
  });

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageReq, totalPages);
  const pageItems = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categories = await getCategories();

  return (
    <>
      {/* Page header band */}
      <section className="bg-blush-soft">
        <Container className="flex flex-col gap-4 py-[clamp(40px,5vw,72px)]">
          <nav className="text-[11px] uppercase tracking-nav text-mauve" aria-label="Migas de pan">
            Inicio / <span className="text-burgundy">Tienda</span>
          </nav>
          <h1 className="font-display text-[clamp(32px,4vw,52px)] text-ink">
            {q ? `Resultados para “${q}”` : "La tienda"}
          </h1>
          <p className="max-w-prose text-[15px] font-light leading-[1.75] text-ink/70">
            Piezas seleccionadas con cuidado para tu bienestar íntimo. Envío discreto,
            empaque 100% neutro y calidad en la que puedes confiar.
          </p>
        </Container>
      </section>

      <CatalogView
        products={pageItems}
        total={total}
        page={page}
        totalPages={totalPages}
        categories={categories}
        selectedCategories={cat}
        min={min}
        max={max}
        sort={sort}
      />
    </>
  );
}

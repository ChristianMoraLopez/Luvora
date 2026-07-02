import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Catalog } from "@/components/product/Catalog";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";

export const metadata: Metadata = {
  title: "La tienda",
  description:
    "Explora el catálogo LUVORA: juguetes, lencería, lubricantes, bienestar y kits. Envío discreto en toda Colombia.",
};

export default function TiendaPage() {
  return (
    <>
      {/* Page header band */}
      <section className="bg-blush-soft">
        <Container className="flex flex-col gap-4 py-[clamp(40px,5vw,72px)]">
          <nav className="text-[11px] uppercase tracking-nav text-mauve" aria-label="Migas de pan">
            Inicio / <span className="text-burgundy">Tienda</span>
          </nav>
          <h1 className="font-display text-[clamp(32px,4vw,52px)] text-ink">La tienda</h1>
          <p className="max-w-prose text-[15px] font-light leading-[1.75] text-ink/70">
            Piezas seleccionadas con cuidado para tu bienestar íntimo. Envío discreto,
            empaque 100% neutro y calidad en la que puedes confiar.
          </p>
        </Container>
      </section>

      <Suspense
        fallback={
          <Container className="py-16">
            <ProductGridSkeleton count={9} minColumn={210} />
          </Container>
        }
      >
        <Catalog />
      </Suspense>
    </>
  );
}

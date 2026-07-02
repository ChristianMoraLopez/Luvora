import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getBestSellers } from "@/data/products";

/** "Los más deseados" — best-selling products grid. */
export function BestSellers() {
  const products = getBestSellers(4);

  return (
    <section className="bg-ivory">
      <Container className="py-section">
        <SectionHeader
          eyebrow="Los favoritos"
          title="Los más deseados"
          link={{ href: "/tienda", label: "Ver toda la tienda" }}
        />
        <ProductGrid products={products} priorityCount={4} />
      </Container>
    </section>
  );
}

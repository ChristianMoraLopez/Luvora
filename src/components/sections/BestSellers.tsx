import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types";

/** "Los más deseados" — best-selling products grid (from v_product_cards). */
export function BestSellers({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;

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

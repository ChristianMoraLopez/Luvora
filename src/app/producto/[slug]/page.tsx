import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug, getRelated } from "@/lib/catalog";

// Render on-demand (235 products → don't prebuild; build stays DB-independent).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: (product.description || product.categoryName).slice(0, 150),
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelated(product.categorySlug, product.slug, 4);
  const badge = product.badges?.[0];

  const sizes = (product.attributes?.sizes as string[] | undefined) ?? [];
  const care = [
    product.brand ? `Marca: ${product.brand}.` : null,
    sizes.length ? `Presentación: ${sizes.join(", ")}.` : null,
    "Conserva en un lugar fresco y seco. Límpialo según las indicaciones del empaque.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Container className="py-[clamp(28px,4vw,56px)]">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[11px] uppercase tracking-nav text-mauve" aria-label="Migas de pan">
          <Link href="/" className="hover:text-burgundy">
            Inicio
          </Link>{" "}
          /{" "}
          <Link href="/tienda" className="hover:text-burgundy">
            Tienda
          </Link>{" "}
          / <span className="text-burgundy">{product.name}</span>
        </nav>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[clamp(36px,5vw,72px)]">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-mauve">
                {product.categorySlug ? (
                  <Link href={`/tienda?cat=${product.categorySlug}`} className="hover:text-burgundy">
                    {product.categoryName}
                  </Link>
                ) : (
                  product.categoryName
                )}
                {badge && <Badge badge={badge} />}
              </span>
              <h1 className="font-display text-[clamp(30px,3.6vw,46px)] leading-tight text-ink">
                {product.name}
              </h1>
              {product.subcategory && (
                <p className="text-[14px] font-light text-ink/60">{product.subcategory}</p>
              )}
            </div>

            <PurchasePanel product={product} />

            <Accordion
              items={[
                {
                  title: "Detalles",
                  content: product.description || "Ficha del producto disponible próximamente.",
                },
                { title: "Materiales y cuidado", content: care },
                {
                  title: "Envío discreto",
                  content:
                    "Envío discreto en empaque 100% neutro, sin logotipos ni referencias al contenido. Entrega en 24–72h en las principales ciudades de Colombia.",
                },
              ]}
            />
          </div>
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-blush-soft">
          <Container className="py-section">
            <h2 className="mb-10 font-display text-[clamp(24px,3vw,36px)] text-ink">
              También te puede gustar
            </h2>
            <ProductGrid products={related} minColumn={220} />
          </Container>
        </section>
      )}
    </>
  );
}

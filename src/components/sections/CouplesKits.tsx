import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { formatCOP } from "@/lib/format";
import type { ProductCardData } from "@/types";

/** Couples / gifts feature band — warm, editorial, on champagne. */
export function CouplesKits({ product }: { product: ProductCardData | null }) {
  if (!product) return null;
  const isRange = product.priceMax != null && product.priceMax > product.price;

  return (
    <section className="bg-champagne/50">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(32px,5vw,72px)] py-section">
        <Reveal>
          <Link href={`/producto/${product.slug}`} className="block max-w-[460px]">
            <ProductImage src={product.image} alt={product.name} label={product.name} ratio="4/5" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-5">
          <span className="eyebrow text-burgundy">Para compartir</span>
          <h2 className="max-w-[16ch] font-display text-[clamp(28px,3.4vw,44px)] leading-[1.12] text-ink">
            Juegos y regalos para descubrir en pareja.
          </h2>
          <p className="max-w-prose text-[15px] font-light leading-[1.75] text-ink/70">
            Selecciones cuidadas que hacen del primer paso algo natural y hermoso.
            Presentación de regalo, dentro de un empaque exterior 100% neutro.
          </p>
          <div className="flex items-baseline gap-2">
            {isRange && <span className="text-[13px] font-light text-mauve">Desde</span>}
            <span className="font-display text-2xl text-burgundy">{formatCOP(product.price)}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-3.5">
            <Button href={`/producto/${product.slug}`} variant="solid" size="md">
              Ver el producto
            </Button>
            <Button href="/tienda?cat=juegos-y-regalos" variant="outline" size="md">
              Juegos y regalos
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

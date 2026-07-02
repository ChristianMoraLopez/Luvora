"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeartIcon } from "@/components/brand/Icons";
import { useWishlistStore } from "@/store/wishlist";
import { products } from "@/data/products";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <Container className="py-[clamp(32px,5vw,64px)]">
      <div className="mb-10 flex flex-col gap-3">
        <span className="eyebrow text-burgundy">Tus favoritos</span>
        <h1 className="font-display text-[clamp(30px,4vw,48px)]">Lista de deseos</h1>
      </div>

      {saved.length > 0 ? (
        <ProductGrid products={saved} minColumn={230} />
      ) : (
        <div className="flex flex-col items-center gap-5 py-24 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-blush-soft text-burgundy">
            <HeartIcon size={30} />
          </span>
          <h2 className="font-display text-2xl">Aún no tienes favoritos</h2>
          <p className="max-w-[34ch] text-[14px] font-light text-ink/70">
            Guarda las piezas que te enamoren tocando el corazón en cada producto.
          </p>
          <Button href="/tienda" variant="solid" size="md" className="mt-1">
            Explorar tienda
          </Button>
        </div>
      )}
    </Container>
  );
}

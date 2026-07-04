"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { HeartIcon } from "@/components/brand/Icons";
import { useWishlistStore } from "@/store/wishlist";
import { createClient } from "@/lib/supabase/client";
import { imageUrl } from "@/lib/images";
import type { ProductCardData } from "@/types";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const [saved, setSaved] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (ids.length === 0) {
      setSaved([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("v_product_cards").select("*").in("id", ids);
      if (!alive) return;
      const rows = ((data ?? []) as any[]).map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        brand: r.brand ?? null,
        price: r.price ?? 0,
        priceMax: r.price_max ?? null,
        badges: r.badges ?? [],
        rating: r.rating ?? null,
        category: r.category ?? "",
        categorySlug: r.category_slug ?? "",
        subcategory: r.subcategory ?? null,
        image: imageUrl(r.primary_image),
        variantCount: Number(r.variant_count ?? 0),
        tags: r.tags ?? [],
      }));
      // Preserve the order the user saved them in.
      rows.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      setSaved(rows);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [ids]);

  return (
    <Container className="py-[clamp(32px,5vw,64px)]">
      <div className="mb-10 flex flex-col gap-3">
        <span className="eyebrow text-burgundy">Tus favoritos</span>
        <h1 className="font-display text-[clamp(30px,4vw,48px)]">Lista de deseos</h1>
      </div>

      {loading && ids.length > 0 ? (
        <ProductGridSkeleton count={4} minColumn={230} />
      ) : saved.length > 0 ? (
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

import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { FeaturedCategories } from "@/components/sections/FeaturedCategories";
import { BestSellers } from "@/components/sections/BestSellers";
import { CouplesKits } from "@/components/sections/CouplesKits";
import { Testimonials } from "@/components/sections/Testimonials";
import { getBestSellers, getCategories, getFeaturedProduct } from "@/lib/catalog";

// Render on-demand so the build never depends on DB reachability; SSR keeps
// the catalog fresh on every request (Supabase reads are fast).
export const dynamic = "force-dynamic";

/**
 * Inicio (Landing) — data from Supabase (best sellers, categories, a featured
 * product for the couples/gifts band). Design unchanged. Newsletter + Footer
 * live in the shared chrome (SiteShell → Footer).
 */
export default async function HomePage() {
  const [bestSellers, categories, featured] = await Promise.all([
    getBestSellers(8),
    getCategories(),
    getFeaturedProduct("juegos-y-regalos"),
  ]);

  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedCategories categories={categories} />
      <BestSellers products={bestSellers} />
      <CouplesKits product={featured} />
      <Testimonials />
    </>
  );
}

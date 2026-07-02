import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { FeaturedCategories } from "@/components/sections/FeaturedCategories";
import { BestSellers } from "@/components/sections/BestSellers";
import { CouplesKits } from "@/components/sections/CouplesKits";
import { Testimonials } from "@/components/sections/Testimonials";

/**
 * Inicio (Landing) — recreates the design handoff, localized to es-CO / COP,
 * extended with the brief's landing sections (categories, kits, testimonials).
 * Newsletter + Footer live in the shared chrome (SiteShell → Footer).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedCategories />
      <BestSellers />
      <CouplesKits />
      <Testimonials />
    </>
  );
}

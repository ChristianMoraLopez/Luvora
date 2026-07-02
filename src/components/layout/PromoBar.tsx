import { siteConfig } from "@/config/site";

/** Full-bleed announcement bar — discreet shipping / neutral packaging / secure payment. */
export function PromoBar() {
  return (
    <div className="bg-burgundy text-champagne">
      <p className="mx-auto max-w-content px-gutter py-2.5 text-center text-[10.5px] font-medium tracking-promo">
        {siteConfig.promoBar}
      </p>
    </div>
  );
}

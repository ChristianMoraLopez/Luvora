import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerNav, siteConfig } from "@/config/site";
import { Newsletter } from "@/components/sections/Newsletter";

export function Footer() {
  return (
    <footer className="bg-burgundy-deep text-ivory">
      <Newsletter />

      <Container className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-12 pb-14 pt-16">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <BrandMark size={24} stroke="#D9B48C" dotColor="#D9B48C" />
            <Wordmark className="text-[19px]" color="#F8F6F2" />
          </div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-blush">
            {siteConfig.tagline.toUpperCase()}
          </p>
          <p className="max-w-[34ch] text-[13px] font-light leading-[1.7] text-ivory/65">
            Compra 100% discreta. Empaque neutro, sin logotipos ni referencias en el envío.
          </p>
        </div>

        {/* Link columns */}
        {[footerNav.tienda, footerNav.ayuda].map((col) => (
          <div key={col.title} className="flex flex-col gap-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne-gold">
              {col.title}
            </p>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] font-light text-ivory/80 transition-colors hover:text-ivory"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-4 border-t border-ivory/15 py-5">
        <p className="text-[11.5px] font-light tracking-[0.06em] text-ivory/60">
          © {new Date().getFullYear()} LUVORA — Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-2.5">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full border border-ivory/40 text-[10px] font-semibold text-ivory/80">
            +18
          </span>
          <span className="text-[11.5px] font-light text-ivory/60">{siteConfig.ageNotice}</span>
        </div>
      </Container>
    </footer>
  );
}

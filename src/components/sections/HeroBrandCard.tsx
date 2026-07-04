import { BrandMark, HeartArt } from "@/components/brand/Logo";

/**
 * Editorial brand card for the hero — a designed "LUVORA" image (no photography
 * needed): warm champagne gradient, a gold inset frame, a large watermark heart,
 * and the wordmark + tagline. Reads as intentional art, not a placeholder.
 */
export function HeroBrandCard() {
  return (
    <div
      className="relative aspect-[4/5] w-full max-h-[620px] overflow-hidden rounded-card"
      style={{ background: "linear-gradient(160deg, #F8F6F2 0%, #EBDCCB 52%, #D9B48C 118%)" }}
      role="img"
      aria-label="LUVORA — Bienestar íntimo"
    >
      {/* soft radial glow, top-right */}
      <div
        className="pointer-events-none absolute -right-1/3 -top-1/4 h-4/5 w-4/5 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(214,165,180,0.55), transparent 68%)" }}
      />
      {/* large watermark heart, bottom-left */}
      <div className="pointer-events-none absolute -bottom-16 -left-14 h-[78%] w-[78%] opacity-[0.07]">
        <HeartArt stroke="#6B1E3A" strokeWidth={9} />
      </div>

      {/* gold inset frame */}
      <div className="pointer-events-none absolute inset-3 rounded-[5px] border border-champagne-gold/45 sm:inset-4" />

      {/* content */}
      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center sm:gap-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-burgundy/70">
          Bienestar íntimo
        </span>

        <BrandMark size={52} />

        <span
          className="font-display text-[clamp(30px,7vw,52px)] leading-none text-burgundy"
          style={{ letterSpacing: "0.22em" }}
        >
          LUVORA
        </span>

        <span className="h-px w-12 bg-champagne-gold" />

        <p className="max-w-[20ch] font-display text-[clamp(14px,2.4vw,18px)] italic leading-snug text-burgundy/80">
          Placer, conexión y bienestar sin tabúes.
        </p>

        <span className="mt-1 text-[9.5px] uppercase tracking-[0.3em] text-burgundy/55">
          Colombia · Envío discreto
        </span>
      </div>
    </div>
  );
}

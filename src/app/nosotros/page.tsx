import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TrustBadges } from "@/components/sections/TrustBadges";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "LUVORA nace en Colombia para hablar de bienestar íntimo sin tabúes: con elegancia, cuidado y total discreción.",
};

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-burgundy text-ivory">
        <Container className="flex flex-col items-center gap-6 py-[clamp(56px,7vw,104px)] text-center">
          <span className="eyebrow text-champagne-gold">Nuestra historia</span>
          <h1 className="max-w-[16ch] font-display text-[clamp(34px,4.6vw,60px)] leading-[1.1]">
            Bienestar íntimo, <em className="italic text-blush">sin tabúes</em>.
          </h1>
          <p className="max-w-prose text-[16px] font-light leading-[1.8] text-ivory/80">
            LUVORA nace en Colombia con una idea simple: el placer y el cuidado íntimo merecen
            hablarse con naturalidad, buen gusto y respeto. Seleccionamos cada producto con criterio
            y lo entregamos con total discreción.
          </p>
        </Container>
      </section>

      <TrustBadges />

      <Container className="grid gap-10 py-section md:grid-cols-3">
        {[
          {
            t: "Curaduría con criterio",
            d: "Elegimos marcas y materiales seguros — silicona grado médico, fórmulas respetuosas con tu piel.",
          },
          {
            t: "Discreción absoluta",
            d: "Empaque 100% neutro, sin logotipos ni referencias. Tu privacidad es la prioridad.",
          },
          {
            t: "Hecho para Colombia",
            d: "Precios en pesos, envío nacional 24–72h y atención cercana por WhatsApp.",
          },
        ].map((v, i) => (
          <Reveal key={v.t} delay={i * 0.08} className="flex flex-col gap-3">
            <span className="font-display text-3xl text-burgundy/30">0{i + 1}</span>
            <h3 className="font-display text-2xl">{v.t}</h3>
            <p className="text-[14px] font-light leading-relaxed text-ink/70">{v.d}</p>
          </Reveal>
        ))}
      </Container>
    </>
  );
}

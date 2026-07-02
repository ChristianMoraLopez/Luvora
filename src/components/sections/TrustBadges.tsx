import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import {
  DiscretionIcon,
  PackageIcon,
  QualityIcon,
  HeartIcon,
} from "@/components/brand/Icons";

const badges = [
  { Icon: DiscretionIcon, label: ["Discreción", "total"] },
  { Icon: PackageIcon, label: ["Empaque", "discreto"] },
  { Icon: QualityIcon, label: ["Productos", "de calidad"] },
  { Icon: HeartIcon, label: ["Bienestar y", "confianza"] },
];

/** Trust / benefits strip on blush background. */
export function TrustBadges() {
  return (
    <section className="bg-blush-soft">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-8 py-[clamp(40px,5vw,64px)]">
        {badges.map(({ Icon, label }, i) => (
          <Reveal
            key={label.join(" ")}
            delay={i * 0.08}
            className="flex flex-col items-center gap-3.5 text-center"
          >
            <Icon size={32} className="text-burgundy" />
            <p className="text-[11.5px] font-semibold uppercase leading-[1.5] tracking-nav text-burgundy">
              {label[0]}
              <br />
              {label[1]}
            </p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}

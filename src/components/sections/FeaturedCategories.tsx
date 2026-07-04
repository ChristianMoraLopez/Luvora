import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "./SectionHeader";
import { HeartMark } from "@/components/brand/Logo";
import { ArrowRightIcon } from "@/components/brand/Icons";
import type { DbCategory } from "@/types";

/** Editorial category tiles (from the categories table). */
export function FeaturedCategories({ categories }: { categories: DbCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-ivory">
      <Container className="py-section">
        <SectionHeader eyebrow="Explora" title="Categorías" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[clamp(16px,2vw,24px)]">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={(i % 3) * 0.06}>
              <Link
                href={`/tienda?cat=${cat.slug}`}
                className="group flex h-full flex-col justify-between gap-8 rounded-card border border-burgundy/10 bg-white/50 p-7 transition-all duration-300 ease-luxe hover:border-burgundy/25 hover:shadow-soft"
              >
                <span className="h-9 w-9 text-burgundy">
                  <HeartMark stroke="#6B1E3A" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl text-ink">{cat.name}</h3>
                  <p className="text-[13px] font-light leading-relaxed text-ink/65">
                    {cat.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-nav text-burgundy">
                    Ver categoría
                    <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { easing } from "@/config/tokens";
import { ChevronRightIcon } from "@/components/brand/Icons";
import { testimonials } from "@/data/products";
import { cn } from "@/lib/utils";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex justify-center gap-1" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "text-champagne-gold" : "text-mauve/30"}>
          ★
        </span>
      ))}
    </div>
  );
}

/** Testimonials carousel — one quote at a time, manual + gentle auto-advance. */
export function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    setDir(next > index || (index === testimonials.length - 1 && next === 0) ? 1 : -1);
    setIndex((next + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6500);
    return () => clearInterval(t);
  }, [reduce]);

  const t = testimonials[index];

  return (
    <section className="bg-burgundy text-ivory">
      <Container className="flex flex-col items-center gap-8 py-section text-center">
        <span className="eyebrow text-champagne-gold">Testimonios</span>

        <div className="relative flex min-h-[220px] w-full max-w-3xl items-center justify-center">
          <button
            aria-label="Anterior"
            onClick={() => go(index - 1)}
            className="absolute left-0 hidden rounded-full p-2 text-ivory/60 transition-colors hover:text-ivory sm:block"
          >
            <ChevronRightIcon size={26} className="rotate-180" />
          </button>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={t.id}
              custom={dir}
              initial={reduce ? false : { opacity: 0, x: dir * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: dir * -30 }}
              transition={{ duration: 0.5, ease: easing.luxe }}
              className="flex flex-col items-center gap-6 px-8"
            >
              <Stars n={t.rating} />
              <p className="max-w-[34ch] font-display text-[clamp(20px,2.6vw,30px)] leading-[1.35] text-ivory">
                “{t.quote}”
              </p>
              <footer className="text-[12px] uppercase tracking-nav text-blush">
                {t.author} · {t.location}
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <button
            aria-label="Siguiente"
            onClick={() => go(index + 1)}
            className="absolute right-0 hidden rounded-full p-2 text-ivory/60 transition-colors hover:text-ivory sm:block"
          >
            <ChevronRightIcon size={26} />
          </button>
        </div>

        <div className="flex gap-2.5">
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Ir al testimonio ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-champagne" : "w-1.5 bg-ivory/30 hover:bg-ivory/60",
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

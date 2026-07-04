"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { easing } from "@/config/tokens";

/** Hero — brand statement on burgundy, editorial image right. */
export function Hero() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-burgundy">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(36px,5vw,64px)] py-[clamp(56px,7vw,96px)]">
        <motion.div
          initial={reduce ? false : "hidden"}
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
          className="flex flex-col gap-6"
        >
          <motion.p
            variants={item}
            transition={{ duration: 0.6, ease: easing.luxe }}
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-champagne-gold"
          >
            Bienestar íntimo · Placer · Conexión
          </motion.p>
          <motion.h1
            variants={item}
            transition={{ duration: 0.7, ease: easing.luxe }}
            className="max-w-[14ch] font-display text-[clamp(38px,4.6vw,62px)] font-medium leading-[1.12] text-ivory"
          >
            Placer, conexión y bienestar <em className="not-italic text-blush italic">sin tabúes</em>.
          </motion.h1>
          <motion.p
            variants={item}
            transition={{ duration: 0.7, ease: easing.luxe }}
            className="max-w-prose text-[15px] font-light leading-[1.75] text-ivory/80"
          >
            Productos seleccionados con cuidado para tu bienestar íntimo. Envío discreto,
            empaque neutro y calidad en la que puedes confiar.
          </motion.p>
          <motion.div
            variants={item}
            transition={{ duration: 0.7, ease: easing.luxe }}
            className="mt-1.5 flex flex-wrap gap-3.5"
          >
            <Button href="/tienda" variant="primary" size="md">
              Explorar tienda
            </Button>
            <Button href="/tienda?cat=juegos-y-regalos" variant="outlineDark" size="md">
              Kits y regalos
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: easing.luxe, delay: 0.15 }}
          className="max-h-[620px]"
        >
          <ProductImage
            src={undefined}
            alt="Editorial de marca LUVORA"
            label="LUVORA"
            ratio="4/5"
            priority
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </motion.div>
      </Container>
    </section>
  );
}

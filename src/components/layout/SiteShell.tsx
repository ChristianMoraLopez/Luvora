"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { easing } from "@/config/tokens";
import { useIntroStore } from "@/store/intro";
import { PromoBar } from "./PromoBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { IntroAnimation } from "@/components/intro/IntroAnimation";
import { CartDrawer } from "@/components/cart/CartDrawer";

/**
 * App chrome + intro orchestration.
 *
 * `LayoutGroup` scopes the shared-layout morph: while the intro plays it owns
 * the `brand-lockup` element (centered, large); when it finishes, the header's
 * lockup takes over the same `layoutId` and Framer Motion flies it home.
 *
 * SSR-safe: the intro is client-only (`mounted` gate), so first paint / no-JS
 * renders the full page visible — good for SEO and resilience.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  const hasPlayed = useIntroStore((s) => s.hasPlayed);
  const markPlayed = useIntroStore((s) => s.markPlayed);

  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (hasPlayed || prefersReduced) setIntroDone(true);
  }, [hasPlayed, prefersReduced]);

  const playing = mounted && !introDone;

  const finish = useCallback(() => {
    setIntroDone(true);
    markPlayed();
  }, [markPlayed]);

  return (
    <LayoutGroup>
      <PromoBar />
      <Header playing={playing} introComplete={introDone} />

      <motion.main
        id="contenido"
        className="min-h-[60vh]"
        initial={false}
        animate={{ opacity: playing ? 0 : 1, y: playing ? 8 : 0 }}
        transition={{
          duration: 0.7,
          ease: easing.luxe,
          delay: introDone && mounted ? 0.15 : 0,
        }}
      >
        {children}
      </motion.main>

      <Footer />

      {playing && <IntroAnimation onComplete={finish} reduced={!!prefersReduced} />}
      <CartDrawer />
    </LayoutGroup>
  );
}

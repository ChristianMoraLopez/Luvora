"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { easing } from "@/config/tokens";

/**
 * LUVORA brand intro — plays the brand's own Lottie logotype animation
 * (public/lottie/luvora-wordmark.json, authored in Jitter, watermark removed,
 * background matched to brand ivory).
 *
 * The JSON is fetched at runtime so it stays out of the initial JS bundle.
 * On completion — or a click/tap to skip — `onComplete` reveals the site.
 * Skipped entirely under reduced motion.
 */

const FALLBACK_MS = 7000; // safety net if the Lottie "complete" event is missed

export function IntroAnimation({
  onComplete,
  reduced = false,
}: {
  onComplete: () => void;
  reduced?: boolean;
}) {
  const [data, setData] = useState<object | null>(null);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    let alive = true;
    fetch("/lottie/luvora-wordmark.json")
      .then((r) => r.json())
      .then((json) => alive && setData(json))
      .catch(() => alive && onComplete()); // if it fails to load, don't block the site

    const skipTimer = setTimeout(() => alive && setShowSkip(true), 1200);
    const safety = setTimeout(() => alive && onComplete(), FALLBACK_MS);

    return () => {
      alive = false;
      clearTimeout(skipTimer);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] grid cursor-pointer place-items-center bg-ivory px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: easing.luxe }}
      onClick={onComplete}
      role="button"
      aria-label="Saltar introducción"
    >
      {data && (
        <motion.div
          className="w-full max-w-[760px]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: easing.luxe }}
        >
          <Lottie
            animationData={data}
            loop={false}
            autoplay
            onComplete={onComplete}
            aria-label="LUVORA"
          />
        </motion.div>
      )}

      {showSkip && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 text-[11px] uppercase tracking-nav text-mauve"
        >
          Saltar
        </motion.span>
      )}
    </motion.div>
  );
}

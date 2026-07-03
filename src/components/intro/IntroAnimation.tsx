"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { AnimatePresence, motion } from "framer-motion";
import { easing } from "@/config/tokens";
import { BrandMark } from "@/components/brand/Logo";

/**
 * LUVORA brand intro — three phases:
 *
 *   1. PLAY   — the brand's own Lottie logotype plays (public/lottie/…,
 *              authored in Jitter, watermark removed, bg matched to ivory).
 *   2. SETTLE — on complete, the Lottie cross-fades into the DOM logo lockup
 *              (heart + LUVORA) at the header's exact proportions, carrying
 *              `layoutId="brand-lockup"`.
 *   3. MORPH  — `onComplete` unmounts this overlay while the header mounts the
 *              same `layoutId`, so Framer Motion scales + travels the lockup
 *              into the header in one fluid, shared-layout motion.
 *
 * Once per session; reduced-motion skips it; click/tap skips ahead.
 */

const FALLBACK_MS = 7000; // safety net if the Lottie "complete" event is missed

/**
 * Lockup dimensions that keep the header's exact mark:word:gap ratio
 * (28 : 23 : 12) at any scale → the shared-layout morph is a uniform scale.
 * Sized down on small screens so the centered lockup never overflows.
 */
function useLockupDims() {
  const [dims] = useState(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
    const mark = vw < 400 ? 48 : vw < 640 ? 62 : 96;
    return { mark, word: Math.round((mark * 23) / 28), gap: Math.round((mark * 12) / 28) };
  });
  return dims;
}

export function IntroAnimation({
  onComplete,
  reduced = false,
}: {
  onComplete: () => void;
  reduced?: boolean;
}) {
  const [data, setData] = useState<object | null>(null);
  const [phase, setPhase] = useState<"playing" | "settle">("playing");
  const [showSkip, setShowSkip] = useState(false);
  const { mark, word, gap } = useLockupDims();

  // Load the Lottie (lazy, off the initial bundle) + reduced-motion skip.
  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    let alive = true;
    fetch("/lottie/luvora-wordmark.json")
      .then((r) => r.json())
      .then((json) => alive && setData(json))
      .catch(() => alive && setPhase("settle")); // if it fails, still show the lockup + morph

    const skipTimer = setTimeout(() => alive && setShowSkip(true), 1200);
    const safety = setTimeout(() => alive && setPhase("settle"), FALLBACK_MS);
    return () => {
      alive = false;
      clearTimeout(skipTimer);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Once settled (cross-fade landed), hand off to the header's shared-layout morph.
  useEffect(() => {
    if (phase !== "settle") return;
    const t = setTimeout(onComplete, 660);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] grid cursor-pointer place-items-center overflow-hidden bg-ivory px-8"
      initial={{ opacity: 1 }}
      // No exit animation: the overlay unmounts instantly so the shared-layout
      // morph (center → header) is the only motion the eye follows, on ivory.
      onClick={() => (phase === "playing" ? setPhase("settle") : onComplete())}
      role="button"
      aria-label="Saltar introducción"
    >
      {/* Phase 1 — Lottie logotype (fades out into the lockup) */}
      <AnimatePresence>
        {phase === "playing" && data && (
          <motion.div
            key="lottie"
            className="w-full"
            style={{ maxWidth: 560 }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: easing.luxe } }}
            transition={{ duration: 0.5, ease: easing.luxe }}
          >
            <Lottie
              animationData={data}
              loop={false}
              autoplay
              onComplete={() => setPhase("settle")}
              aria-label="LUVORA"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2 — DOM lockup carrying the shared layoutId (→ header) */}
      {phase === "settle" && (
        <motion.div
          layoutId="brand-lockup"
          className="inline-flex items-center"
          style={{ gap }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: easing.luxe }}
        >
          <BrandMark size={mark} />
          <span
            className="font-display leading-none text-ink"
            style={{ letterSpacing: "0.3em", fontSize: word }}
          >
            LUVORA
          </span>
        </motion.div>
      )}

      {showSkip && phase === "playing" && (
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

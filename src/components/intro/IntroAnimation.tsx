"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import { easing } from "@/config/tokens";
import { HeartArt } from "@/components/brand/Logo";

/**
 * LUVORA brand intro — scripted timeline.
 *
 *   1. Only the heart shows, centered.
 *   2. It beats gently twice.
 *   3. A golden dot drops in above it.
 *   4. "LUVORA" fades in beside it.
 *   5. A brief pause…
 *   6/7. …then `onComplete` fires. The parent unmounts this overlay while the
 *        header renders the same `layoutId="brand-lockup"` element, so Framer
 *        Motion morphs (scales down + travels) the lockup into the header in
 *        one fluid, shared-layout motion.
 *
 * The lockup keeps the header's exact internal proportions (mark : word : gap),
 * so the shared-layout morph is a single uniform scale — no snap.
 */

const MARK = 96; // px — hero mark size (header mark is 28 → uniform 0.29× morph)
const WORD_PX = 79; // 96 × (23/28) keeps header proportions
const GAP = 41; // 12 × (96/28)
const DOT = Math.round(MARK * 0.13);

const delay = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

export function IntroAnimation({
  onComplete,
  reduced = false,
}: {
  onComplete: () => void;
  reduced?: boolean;
}) {
  const [scope, animate] = useAnimate();
  const heartRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    let cancelled = false;
    const ease = easing.luxe;

    (async () => {
      // 1 — heart appears
      await animate(heartRef.current!, { opacity: 1, scale: 1 }, { duration: 0.5, ease });
      // 2 — beats twice
      await animate(
        heartRef.current!,
        { scale: [1, 1.16, 1, 1.16, 1] },
        { duration: 1.15, ease: "easeInOut", times: [0, 0.22, 0.44, 0.66, 1] },
      );
      if (cancelled) return;
      // 3 — golden dot drops in
      await animate(
        dotRef.current!,
        { opacity: [0, 1], scale: [0.2, 1], y: [-10, 0] },
        { duration: 0.5, ease },
      );
      if (cancelled) return;
      // 4 — wordmark fades in from behind the mark
      await animate(
        wordRef.current!,
        { opacity: [0, 1], x: [-8, 0] },
        { duration: 0.6, ease },
      );
      // 5 — pause, then hand off
      await delay(0.65);
      if (!cancelled) onComplete();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-[60] grid place-items-center bg-ivory"
      initial={{ opacity: 1 }}
      // No exit animation: the overlay unmounts instantly so the shared-layout
      // morph (source → header target) is the only motion the eye follows.
      aria-hidden="true"
    >
      <motion.div
        layoutId="brand-lockup"
        className="inline-flex items-center"
        style={{ gap: GAP }}
      >
        {/* Brand mark: the attached heart artwork + floating golden dot */}
        <span className="relative inline-block shrink-0" style={{ width: MARK, height: MARK }}>
          <motion.span
            ref={heartRef}
            className="block h-full w-full"
            style={{ opacity: 0, scale: 0.9 }}
          >
            <HeartArt stroke="#6B1E3A" />
          </motion.span>
          <motion.span
            ref={dotRef}
            className="absolute rounded-full"
            style={{
              width: DOT,
              height: DOT,
              left: "50%",
              marginLeft: -DOT / 2,
              top: -DOT * 0.4,
              background: "#D9B48C",
              opacity: 0,
            }}
          />
        </span>

        {/* Wordmark */}
        <motion.span
          ref={wordRef}
          className="font-display leading-none text-ink"
          style={{ opacity: 0, letterSpacing: "0.3em", fontSize: WORD_PX }}
        >
          LUVORA
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

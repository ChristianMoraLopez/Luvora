"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useReducedMotion } from "framer-motion";

/**
 * Optional animated LUVORA wordmark (public/lottie/luvora-wordmark.json).
 * Loaded lazily to keep the JSON out of the initial bundle. Falls back to a
 * static wordmark under reduced-motion.
 */
export function LottieWordmark({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<LottieRefCurrentProps>(null);
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/lottie/luvora-wordmark.json")
      .then((r) => r.json())
      .then((json) => alive && setData(json))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (reduce || !data) {
    return (
      <span
        className={className}
        style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "0.3em" }}
      >
        LUVORA
      </span>
    );
  }

  return (
    <Lottie
      lottieRef={ref}
      animationData={data}
      loop={false}
      autoplay
      className={className}
      aria-label="LUVORA"
    />
  );
}

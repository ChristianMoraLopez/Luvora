import type { Transition, Variants } from "framer-motion";
import { duration, easing } from "@/config/tokens";

/**
 * LUVORA — Motion language.
 * Calm, fluid, "luxurious". Nothing snaps. All easing decelerates into rest.
 */

export const transitions = {
  luxe: { duration: duration.base, ease: easing.luxe } satisfies Transition,
  slow: { duration: duration.slow, ease: easing.luxe } satisfies Transition,
  fast: { duration: duration.fast, ease: easing.luxe } satisfies Transition,
  /** For shared-layout logo travel — spring reads as more "physical". */
  layout: { type: "spring", stiffness: 130, damping: 20, mass: 0.9 } satisfies Transition,
} as const;

/** Fade + rise. The house transition for content entering the viewport. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: transitions.luxe,
  },
};

/** Simple fade, for backgrounds / overlays. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitions.luxe },
};

/** Parent that reveals children in sequence. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Standard viewport config so sections animate once, slightly before fully in view. */
export const inView = {
  once: true,
  margin: "0px 0px -12% 0px",
} as const;

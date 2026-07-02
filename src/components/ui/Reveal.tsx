"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { easing } from "@/config/tokens";

/**
 * Fade + rise on scroll into view. The house entrance animation for sections.
 * Honors reduced-motion (renders statically).
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "section" | "li" | "h2";
} & Omit<HTMLMotionProps<"div">, "ref">) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: easing.luxe, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

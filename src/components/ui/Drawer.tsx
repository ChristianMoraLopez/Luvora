"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easing } from "@/config/tokens";
import { cn } from "@/lib/utils";

type Side = "right" | "left";

const offscreen: Record<Side, string> = { right: "100%", left: "-100%" };

/**
 * Accessible slide-in panel used by the cart and the mobile menu.
 * - Locks body scroll while open
 * - Closes on Escape and backdrop click
 * - Respects reduced motion (Framer Motion honors the OS setting;
 *   distances stay small and easing is calm regardless)
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  side?: Side;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: easing.luxe }}
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              "absolute top-0 h-full w-full max-w-[440px] bg-ivory shadow-drawer",
              side === "right" ? "right-0" : "left-0",
              className,
            )}
            initial={{ x: offscreen[side] }}
            animate={{ x: 0 }}
            exit={{ x: offscreen[side] }}
            transition={{ duration: 0.45, ease: easing.luxe }}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "./ProductImage";
import { easing } from "@/config/tokens";
import { cn } from "@/lib/utils";

/**
 * Product gallery: one large 4:5 image + a row of 1:1 thumbnails.
 * Falls back to branded placeholders when no photography is supplied.
 */
export function ProductGallery({
  images,
  name,
}: {
  images: { url?: string; alt: string }[];
  name: string;
}) {
  const slots = images.length > 0 ? images : [{ url: undefined, alt: name }];
  const [active, setActive] = useState(0);
  const current = slots[Math.min(active, slots.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: easing.luxe }}
          >
            <ProductImage src={current.url} alt={current.alt} label={name} priority ratio="4/5" />
          </motion.div>
        </AnimatePresence>
      </div>

      {slots.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {slots.slice(0, 3).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "overflow-hidden rounded-card ring-offset-2 transition-all",
                active === i ? "ring-2 ring-burgundy" : "ring-1 ring-burgundy/10 hover:ring-burgundy/40",
              )}
            >
              <ProductImage src={img.url} alt={img.alt} ratio="1/1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

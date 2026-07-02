"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easing } from "@/config/tokens";
import { PlusIcon, MinusIcon } from "@/components/brand/Icons";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

/**
 * Product-detail accordion. First item open by default (per handoff).
 * Uses a real <button> header + animated height for smooth, accessible reveal.
 */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-burgundy/12 border-y border-burgundy/12">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `acc-panel-${i}`;
        const btnId = `acc-btn-${i}`;
        return (
          <div key={item.title}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="font-sans text-[12px] font-semibold uppercase tracking-nav text-ink">
                  {item.title}
                </span>
                <span className="text-burgundy">
                  {isOpen ? <MinusIcon size={18} /> : <PlusIcon size={18} />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: easing.luxe }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-6 text-[13px] font-light leading-[1.8] text-ink/75">
                    {item.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

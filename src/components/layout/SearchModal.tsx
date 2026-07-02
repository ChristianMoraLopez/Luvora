"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { easing } from "@/config/tokens";
import { SearchIcon, CloseIcon } from "@/components/brand/Icons";
import { products } from "@/data/products";
import { categoryName } from "@/data/categories";
import { formatCOP } from "@/lib/format";

/** Lightweight instant search over the local catalog (client-side). */
export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          categoryName(p.category).toLowerCase().includes(term) ||
          p.subtitle?.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Buscar productos">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easing.luxe }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 top-0 bg-ivory shadow-drawer"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: easing.luxe }}
          >
            <div className="mx-auto max-w-content px-gutter py-6">
              <div className="flex items-center gap-3 border-b border-burgundy/20 pb-3">
                <SearchIcon size={22} className="text-burgundy" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar productos, categorías…"
                  className="w-full bg-transparent font-display text-2xl text-ink placeholder:text-mauve/50 focus:outline-none"
                />
                <button aria-label="Cerrar búsqueda" onClick={onClose} className="text-ink hover:text-burgundy">
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="mt-4">
                {q && results.length === 0 && (
                  <p className="py-6 text-center text-[14px] text-mauve">
                    No encontramos resultados para “{q}”.
                  </p>
                )}
                <ul className="divide-y divide-border">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/producto/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between gap-4 py-3 hover:text-burgundy"
                      >
                        <span>
                          <span className="block font-display text-lg">{p.name}</span>
                          <span className="eyebrow text-mauve">{categoryName(p.category)}</span>
                        </span>
                        <span className="text-[13px] font-semibold text-burgundy">
                          {formatCOP(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easing } from "@/config/tokens";
import { BrandMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "luvora-age-verified";

/**
 * +18 age gate — shown once (persisted in localStorage), on-brand and blocking.
 * SSR-safe: renders nothing until mounted so first paint / no-JS isn't hidden.
 */
export function AgeGate() {
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(true);
  const [minor, setMinor] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setVerified(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      setVerified(false);
    }
  }, []);

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    setVerified(true);
  };

  const show = mounted && !verified;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[95] grid place-items-center bg-burgundy-deep/95 px-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: easing.luxe }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: easing.luxe, delay: 0.05 }}
            className="w-full max-w-md rounded-card bg-ivory p-9 text-center shadow-drawer"
          >
            <div className="mx-auto mb-5 w-fit">
              <BrandMark size={44} />
            </div>

            {minor ? (
              <>
                <h2 className="font-display text-2xl text-ink">Vuelve pronto</h2>
                <p className="mx-auto mt-3 max-w-[34ch] text-[14px] font-light leading-relaxed text-ink/70">
                  Este sitio es exclusivo para personas mayores de 18 años. Gracias por tu
                  comprensión.
                </p>
                <button
                  onClick={() => setMinor(false)}
                  className="mt-6 text-[12px] uppercase tracking-nav text-burgundy underline underline-offset-4"
                >
                  Volver
                </button>
              </>
            ) : (
              <>
                <span className="eyebrow text-mauve">Contenido +18</span>
                <h2 id="age-gate-title" className="mt-3 font-display text-[clamp(24px,3vw,32px)] text-ink">
                  ¿Eres mayor de edad?
                </h2>
                <p className="mx-auto mt-3 max-w-[36ch] text-[14px] font-light leading-relaxed text-ink/70">
                  {siteConfig.name} es una tienda de bienestar íntimo para personas mayores de 18
                  años. Compra 100% discreta, con empaque neutro.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <Button variant="solid" size="md" fullWidth onClick={confirm}>
                    Sí, soy mayor de 18
                  </Button>
                  <Button variant="outline" size="md" fullWidth onClick={() => setMinor(true)}>
                    Soy menor de edad
                  </Button>
                </div>
                <p className="mt-5 text-[11px] font-light text-ink/50">
                  Al continuar confirmas que eres mayor de edad según la ley colombiana.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

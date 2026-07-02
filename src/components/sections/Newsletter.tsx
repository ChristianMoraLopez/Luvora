"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/brand/Icons";

/** Newsletter opt-in. Wire `onSubmit` to Supabase (subscribers table) or your ESP. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: POST /api/newsletter → Supabase `subscribers`
    setDone(true);
  };

  return (
    <div className="border-b border-ivory/12">
      <Container className="flex flex-col items-center gap-6 py-16 text-center">
        <p className="eyebrow text-champagne-gold">Únete a LUVORA</p>
        <h2 className="max-w-[18ch] font-display text-[clamp(26px,3.4vw,40px)] text-ivory">
          Cuidado íntimo, ideas y novedades — con total discreción.
        </h2>

        {done ? (
          <p className="inline-flex items-center gap-2 text-[14px] text-champagne">
            <CheckIcon size={18} /> ¡Gracias! Revisa tu correo para confirmar.
          </p>
        ) : (
          <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              aria-label="Correo electrónico"
              className="w-full rounded-sm border border-ivory/25 bg-ivory/5 px-4 py-3.5 text-[14px] text-ivory placeholder:text-ivory/45 focus:border-ivory/60 focus:outline-none"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0">
              Suscribirme
            </Button>
          </form>
        )}
        <p className="max-w-[42ch] text-[11.5px] font-light text-ivory/50">
          Al suscribirte aceptas recibir comunicaciones de LUVORA. Puedes darte de baja cuando quieras.
        </p>
      </Container>
    </div>
  );
}

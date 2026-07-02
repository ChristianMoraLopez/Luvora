"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckIcon } from "@/components/brand/Icons";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  return (
    <Container className="grid gap-12 py-[clamp(40px,6vw,80px)] lg:grid-cols-2">
      <div>
        <span className="eyebrow text-burgundy">Contacto</span>
        <h1 className="mt-3 font-display text-[clamp(30px,4vw,48px)]">Hablemos</h1>
        <p className="mt-4 max-w-prose text-[15px] font-light leading-[1.8] text-ink/70">
          ¿Dudas sobre un producto, tu pedido o un regalo? Escríbenos y te respondemos con
          discreción y cariño.
        </p>
        <dl className="mt-8 flex flex-col gap-4 text-[14px]">
          <div>
            <dt className="eyebrow text-mauve">WhatsApp</dt>
            <dd className="mt-1">+57 300 000 0000</dd>
          </div>
          <div>
            <dt className="eyebrow text-mauve">Correo</dt>
            <dd className="mt-1">hola@luvora.co</dd>
          </div>
          <div>
            <dt className="eyebrow text-mauve">Atención</dt>
            <dd className="mt-1">Lun–Sáb · 9:00–18:00 (COT)</dd>
          </div>
        </dl>
      </div>

      {sent ? (
        <div className="flex flex-col items-start gap-3 self-start rounded-card bg-blush-soft p-8 text-burgundy">
          <CheckIcon size={26} />
          <p className="font-display text-2xl">¡Gracias por escribirnos!</p>
          <p className="text-[14px] font-light">Te responderemos muy pronto.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-4 rounded-card border border-border bg-white/50 p-8"
        >
          <Input label="Nombre" required autoComplete="name" />
          <Input label="Correo" type="email" required autoComplete="email" />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="msg" className="eyebrow text-mauve">Mensaje</label>
            <textarea
              id="msg"
              required
              rows={5}
              className="w-full rounded-sm border border-burgundy/15 bg-white/60 px-4 py-3 text-[14px] focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <Button type="submit" variant="solid" size="md">
            Enviar mensaje
          </Button>
        </form>
      )}
    </Container>
  );
}

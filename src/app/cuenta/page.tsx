"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ChevronRightIcon, CheckIcon } from "@/components/brand/Icons";

/**
 * Account entry — passwordless (magic link) sign-in / register.
 * Wire `sendMagicLink` to Supabase Auth: supabase.auth.signInWithOtp({ email }).
 */
export default function CuentaPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })
    setSent(true);
  };

  return (
    <Container className="grid gap-12 py-[clamp(40px,6vw,80px)] lg:grid-cols-2">
      {/* Auth card */}
      <div className="mx-auto w-full max-w-md">
        <span className="eyebrow text-burgundy">Tu cuenta</span>
        <h1 className="mt-3 font-display text-[clamp(30px,4vw,44px)]">
          {mode === "login" ? "Bienvenida de nuevo" : "Crea tu cuenta"}
        </h1>
        <p className="mt-3 text-[14px] font-light leading-relaxed text-ink/70">
          Te enviaremos un enlace seguro a tu correo — sin contraseñas que recordar.
        </p>

        {sent ? (
          <div className="mt-8 flex items-start gap-3 rounded-card bg-blush-soft p-5 text-[14px] text-burgundy">
            <CheckIcon size={20} className="mt-0.5 shrink-0" />
            <p>
              Revisa <strong>{email}</strong>. Te enviamos un enlace para{" "}
              {mode === "login" ? "ingresar" : "crear tu cuenta"} de forma segura.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
            />
            <Button type="submit" variant="solid" size="md" fullWidth>
              {mode === "login" ? "Enviar enlace de acceso" : "Crear cuenta"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-[13px] text-ink/70">
          {mode === "login" ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setSent(false);
            }}
            className="font-semibold text-burgundy underline underline-offset-4"
          >
            {mode === "login" ? "Créala aquí" : "Ingresa"}
          </button>
        </p>
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-3 rounded-card bg-blush-soft/60 p-8">
        <h2 className="mb-2 font-display text-2xl">Tu espacio LUVORA</h2>
        {[
          { href: "/cuenta/pedidos", title: "Mis pedidos", desc: "Sigue el estado de tus compras" },
          { href: "/wishlist", title: "Lista de deseos", desc: "Las piezas que has guardado" },
          { href: "/ayuda/envios", title: "Envíos y devoluciones", desc: "Todo sobre tu entrega discreta" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center justify-between rounded-card bg-ivory px-5 py-4 transition-colors hover:bg-white"
          >
            <span>
              <span className="block font-medium">{l.title}</span>
              <span className="text-[13px] font-light text-ink/60">{l.desc}</span>
            </span>
            <ChevronRightIcon size={20} className="text-burgundy transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </Container>
  );
}

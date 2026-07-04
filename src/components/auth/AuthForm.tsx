"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckIcon } from "@/components/brand/Icons";
import { createClient } from "@/lib/supabase/client";

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

/** Email + password login / signup, plus Google OAuth. */
export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const friendly = (message: string) => {
    const m = message.toLowerCase();
    if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
    if (m.includes("already registered")) return "Ya existe una cuenta con este correo. Inicia sesión.";
    if (m.includes("password")) return "La contraseña debe tener al menos 6 caracteres.";
    if (m.includes("email")) return "Ingresa un correo válido.";
    return "No fue posible completar la acción. Inténtalo de nuevo.";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(friendly(error.message));
      else router.refresh(); // server /cuenta re-reads the session → dashboard
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(friendly(error.message));
      else if (data.session) router.refresh(); // confirmation disabled → logged in
      else setCheckEmail(true); // confirmation email sent
    }
    setLoading(false);
  };

  const google = async () => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/cuenta` },
    });
    if (error) setError("No fue posible conectar con Google.");
  };

  return (
    <Container className="grid gap-12 py-[clamp(40px,6vw,80px)] lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md">
        <span className="eyebrow text-burgundy">Tu cuenta</span>
        <h1 className="mt-3 font-display text-[clamp(30px,4vw,44px)]">
          {mode === "login" ? "Bienvenida de nuevo" : "Crea tu cuenta"}
        </h1>
        <p className="mt-3 text-[14px] font-light leading-relaxed text-ink/70">
          Guarda tus favoritos, sigue tus pedidos y agiliza tu compra — con total discreción.
        </p>

        {checkEmail ? (
          <div className="mt-8 flex items-start gap-3 rounded-card bg-blush-soft p-5 text-[14px] text-burgundy">
            <CheckIcon size={20} className="mt-0.5 shrink-0" />
            <p>
              Te enviamos un correo a <strong>{email}</strong>. Confírmalo para activar tu cuenta.
            </p>
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              type="button"
              onClick={google}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-sm border border-burgundy/20 bg-white/70 py-3.5 text-[13px] font-medium text-ink transition-colors hover:border-burgundy/50"
            >
              <GoogleGlyph />
              Continuar con Google
            </button>

            <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-nav text-mauve">
              <span className="h-px flex-1 bg-border" /> o con tu correo <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
              {mode === "register" && (
                <Input
                  label="Nombre completo"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}
              <Input
                label="Correo electrónico"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Contraseña"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint={mode === "register" ? "Mínimo 6 caracteres." : undefined}
              />

              {error && <p className="text-[13px] text-red-500">{error}</p>}

              <Button type="submit" variant="solid" size="md" fullWidth disabled={loading}>
                {loading ? "Un momento…" : mode === "login" ? "Ingresar" : "Crear cuenta"}
              </Button>
            </form>

            <p className="mt-6 text-[13px] text-ink/70">
              {mode === "login" ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError(null);
                }}
                className="font-semibold text-burgundy underline underline-offset-4"
              >
                {mode === "login" ? "Créala aquí" : "Ingresa"}
              </button>
            </p>
          </>
        )}
      </div>

      {/* Brand aside */}
      <div className="hidden flex-col justify-center gap-4 rounded-card bg-blush-soft/60 p-9 lg:flex">
        <span className="eyebrow text-burgundy">LUVORA</span>
        <h2 className="font-display text-3xl leading-tight">Tu espacio íntimo, seguro y discreto.</h2>
        <ul className="mt-2 flex flex-col gap-3 text-[14px] text-ink/75">
          {["Sigue el estado de tus pedidos", "Guarda tus favoritos", "Compra más rápido", "Envío 100% discreto"].map((t) => (
            <li key={t} className="flex items-center gap-2.5">
              <CheckIcon size={16} className="text-burgundy" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

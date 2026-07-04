import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { AuthForm } from "@/components/auth/AuthForm";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ChevronRightIcon } from "@/components/brand/Icons";

export const metadata: Metadata = { title: "Mi cuenta" };
// Per-user, session-based → always render on demand.
export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged out → login / signup / Google.
  if (!user) return <AuthForm />;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "";

  const links = [
    { href: "/cuenta/pedidos", title: "Mis pedidos", desc: "Sigue el estado de tus compras" },
    { href: "/wishlist", title: "Lista de deseos", desc: "Las piezas que has guardado" },
    { href: "/ayuda/envios", title: "Envíos y devoluciones", desc: "Todo sobre tu entrega discreta" },
  ];

  return (
    <Container className="py-[clamp(40px,6vw,80px)]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-burgundy">Tu cuenta</span>
          <h1 className="mt-3 font-display text-[clamp(30px,4vw,48px)]">
            Hola{displayName ? `, ${displayName}` : ""}
          </h1>
          <p className="mt-2 text-[14px] font-light text-ink/60">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center justify-between rounded-card border border-border bg-white/50 px-6 py-5 transition-colors hover:border-burgundy/25"
          >
            <span>
              <span className="block font-display text-xl">{l.title}</span>
              <span className="text-[13px] font-light text-ink/60">{l.desc}</span>
            </span>
            <ChevronRightIcon size={20} className="text-burgundy transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </Container>
  );
}

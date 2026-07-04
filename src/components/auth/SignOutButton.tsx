"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.refresh();
  };

  return (
    <button
      onClick={signOut}
      className={cn("text-[12px] uppercase tracking-nav text-mauve hover:text-burgundy", className)}
    >
      Cerrar sesión
    </button>
  );
}

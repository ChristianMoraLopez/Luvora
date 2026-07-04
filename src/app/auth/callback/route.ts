import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth / email-confirmation callback. Google (and confirmation links) redirect
 * here with a `code`; we exchange it for a session cookie and continue.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/cuenta";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/cuenta"}`);
    }
  }

  return NextResponse.redirect(`${origin}/cuenta?error=auth`);
}

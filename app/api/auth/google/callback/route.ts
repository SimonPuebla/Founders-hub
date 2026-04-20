import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google-calendar/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/settings?error=oauth_failed", request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const supabase = createClient();

    await supabase.from("settings").upsert({
      id: "default",
      google_refresh_token: tokens.refresh_token,
      google_connected: true,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.redirect(new URL("/settings?success=google_connected", request.url));
  } catch {
    return NextResponse.redirect(new URL("/settings?error=token_exchange_failed", request.url));
  }
}

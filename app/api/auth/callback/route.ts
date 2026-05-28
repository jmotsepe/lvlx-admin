import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.

  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  const code = searchParams.get("code");

  const type = searchParams.get("type");
  const supabaseServer = await createClient();

  if (code) {
    //
    const { error } = await supabaseServer.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect("/auth/sign-in");
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(type === "login" ? "/dashboard" : "/");
}

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.

  // const supabaseServer = createPublicServerClient();

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const supabaseServer = await createClient();
  if (code) {
    const { error } = await supabaseServer.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect("/forgot-password");
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect("/update_password");
}

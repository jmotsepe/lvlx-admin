import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  // Exclude /api/trigger from middleware processing
  if (req.nextUrl.pathname.startsWith("/api/trigger")) {
    return supabaseResponse;
  }

  if (req.nextUrl.pathname === "/docs") {
    return NextResponse.redirect(new URL("/docs/introduction", req.url));
  }

  // Allow access to the reset password page without a session
  if (req.nextUrl.pathname === "/auth/reset-password") {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("AUTH DATA", data);

    if (!data && req.nextUrl.pathname !== "/auth/get-started") {
      return NextResponse.redirect(new URL("/auth/get-started", req.url));
    } else if (
      (data.status === "Pending" || data.status !== "Approved") &&
      req.nextUrl.pathname !== "/auth/activation"
    ) {
      return NextResponse.redirect(new URL("/auth/activation", req.url));
    } else if (
      [
        "/auth/sign-in",
        "/auth/activation",
        "/auth/get-started",
        "/auth/sign-up",
        "/auth/reset-password",
        "/auth/forgot-password",
      ].includes(req.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    // Allow access for sign-in, sign-up, forgot-password, and reset-password pages to non-signed-in users
    if (
      [
        "/auth/sign-in",
        "/auth/sign-up",
        "/auth/forgot-password",
        "/auth/reset-password",
      ].includes(req.nextUrl.pathname)
    ) {
      return supabaseResponse;
    }

    // Redirect if a non-signed-in user tries to access restricted paths
    // Ensure homepage is accessible or redirect to login
    if (req.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/((?!.*..*|_next).*)", "/api/(.*)", "/trpc/(.*)"],
};

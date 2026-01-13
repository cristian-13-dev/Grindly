import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy",
];

const ONBOARDING_PATHS = [
  "/onboarding/consent",
];

export async function middleware(req: NextRequest) {
  const cookiesToSet: Array<{
    name: string;
    value: string;
    options: Record<string, unknown>;
  }> = [];

  const rememberMe = req.cookies.get("remember_me")?.value === "1";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach((c) => cookiesToSet.push(c));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));
  const isOnboarding = ONBOARDING_PATHS.some((p) => path.startsWith(p));

  const tosAccepted = Boolean(
    (user)?.user_metadata?.tosAccepted
  );

  let res: NextResponse;

  if (!user) {
    res = isPublic
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", req.url));
  } else if (!tosAccepted) {
    res = isOnboarding || isPublic
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/onboarding/consent", req.url));
  } else {
    res = isPublic || isOnboarding
      ? NextResponse.redirect(new URL("/", req.url))
      : NextResponse.next();
  }

  cookiesToSet.forEach(({ name, value, options }) => {
    const opts = { ...options } as Record<string, unknown>;

    if (!rememberMe) {
      delete opts.maxAge;
      delete opts.expires;
    }

    res.cookies.set(name, value, opts);
  });

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};

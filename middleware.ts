import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = ["/login", "/sign-up"];

export async function middleware(req: NextRequest) {
  const cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const rememberMe = req.cookies.get("remember_me")?.value === "1";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
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

  let res: NextResponse;

  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
    res = user
      ? NextResponse.redirect(new URL("/", req.url))
      : NextResponse.next();
  } else {
    res = user
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", req.url));
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

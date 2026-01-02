import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import * as jose from 'jose';

const PUBLIC_PATHS = ["/login", "/sign-up", "/api"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("access_token")?.value;

  if (path.startsWith("/login") || path.startsWith("/sign-up")) {
    if (token) {
      try {
        if (process.env.JWT_SECRET) {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET);
          await jose.jwtVerify(token, secret);
        }
        return NextResponse.redirect(new URL("/", req.url));
      } catch (err) {
        if (err instanceof Error) throw new Error(err.message)
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (process.env.JWT_SECRET) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jose.jwtVerify(token, secret);
    }
    return NextResponse.next();
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message)
    return NextResponse.redirect(new URL("/login", req.url));
  }
}


export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
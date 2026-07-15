import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@hamid/core";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";

/**
 * First-pass gate only — this is NOT the sole authorization boundary.
 * Server Actions bypass a Proxy matcher scoped to page routes, so every
 * mutating server action independently calls requirePermission() (see
 * src/lib/auth/rbac.ts). This just keeps unauthenticated/unauthorized users
 * off the dashboard shell itself and bootstraps the locale cookie.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const session = await auth();
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!session.user.permissions?.includes("dashboard.view")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (!cookieLocale || !SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

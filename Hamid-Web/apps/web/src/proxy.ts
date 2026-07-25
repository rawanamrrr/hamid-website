import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@hamid/core";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";
import { getRequiredPermissionForPath, getFirstAccessiblePath } from "@/lib/admin/nav";

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
    const userPermissions = session.user.permissions ?? [];
    // Front door: any granted permission at all is enough to enter the
    // shell. Requiring the literal "dashboard.view" slug here used to lock
    // out any custom role that has plenty of other page permissions but
    // wasn't also explicitly given that specific one — dashboard.view is a
    // feature permission for the KPI overview page, not a prerequisite for
    // using the dashboard at all.
    if (userPermissions.length === 0) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Per-page gate: being let into the shell doesn't mean access to every
    // page inside. Each admin route maps to a specific permission via
    // ADMIN_NAV, and a user missing that permission for the page they're
    // requesting gets sent to their first accessible page instead of seeing
    // (and being able to act on) a page nothing in their role actually
    // grants them — falling back to their first accessible page rather than
    // a hardcoded "/admin", since they may not have dashboard.view either.
    const requiredPermission = getRequiredPermissionForPath(pathname);
    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      return NextResponse.redirect(new URL(getFirstAccessiblePath(userPermissions), request.url));
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

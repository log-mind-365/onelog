import type { JwtPayload, User } from "@supabase/auth-js";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  AUTH_RESTRICTED_ROUTES,
  PROTECTED_ROUTES,
  ROUTES,
} from "@/shared/model/routes";

const isRestrictedAccess = (path: string, user?: JwtPayload) => {
  return user && AUTH_RESTRICTED_ROUTES.some((route) => path.startsWith(route));
};

const isProtectedAccess = (path: string, user?: JwtPayload) => {
  return !user && PROTECTED_ROUTES.some((route) => path.startsWith(route));
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  const path = request.nextUrl.pathname;

  if (isRestrictedAccess(path, user)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.HOME;
    return NextResponse.redirect(url);
  }

  if (isProtectedAccess(path, user)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.AUTH.SIGN_IN;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

import type { JwtPayload } from "@supabase/auth-js";
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

  if (!user) {
    const { data: refreshedUser, error } = await supabase.auth.getUser();

    if (error || !refreshedUser) {
      const path = request.nextUrl.pathname;
      if (isProtectedAccess(path, user)) {
        const url = request.nextUrl.clone();
        url.pathname = ROUTES.AUTH.SIGN_IN;
        return NextResponse.redirect(url);
      }
    }
  }

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

  // Add user ID to request headers for server components to use
  // This avoids duplicate auth calls in pages
  if (user?.sub) {
    supabaseResponse.headers.set("x-user-id", user.sub);
  }
  // 중요: supabaseResponse 객체를 반드시 그대로 반환해야 합니다.
  // NextResponse.next()로 새 응답 객체를 생성할 경우 다음을 반드시 준수하세요:
  //     1. 요청 객체를 다음과 같이 전달하세요:
  //     const myNewResponse = NextResponse.next({ request })
  // 2. 쿠키를 복사하세요. 예를 들어:
  //     myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. 필요에 따라 myNewResponse 객체를 수정하되, 쿠키는 변경하지 마세요!
  // 4. 마지막으로:
  //     return myNewResponse
  // 이를 준수하지 않을 경우, 브라우저와 서버의 동기화가 깨져 사용자의 세션이
  // 조기에 종료될 수 있습니다!
  return supabaseResponse;
}

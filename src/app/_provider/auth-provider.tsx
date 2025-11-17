"use client";

import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import { userQueries } from "@/entities/user/api/queries";
import { useAuth } from "@/features/auth/model/store";
import { supabase } from "@/shared/lib/supabase/client";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { clearMe, setMe } = useAuth();
  const router = useRouter();
  const queryClient = getQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        console.log("INITIAL_SESSION", session);
        if (!session?.user) {
          clearMe();
        } else {
          setTimeout(async () => {
            const userInfo = await queryClient.fetchQuery(
              userQueries.getUserInfo(session.user.id),
            );
            setMe(userInfo);
          }, 0);
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("SIGNED_OUT");
        clearMe();
        router.replace(ROUTES.HOME);
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("TOKEN_REFRESHED");
      }

      if (event === "SIGNED_IN") {
        console.log("SIGNED_IN", session);
        setTimeout(async () => {
          const userInfo = await queryClient.fetchQuery(
            userQueries.getUserInfo(session?.user.id ?? null),
          );
          setMe(userInfo);
          router.replace(ROUTES.HOME);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [clearMe, router, setMe, queryClient]);

  return <>{children}</>;
};

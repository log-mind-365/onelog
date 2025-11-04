"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signOut } from "@/entities/auth/auth.api";
import { getQueryClient } from "@/shared/lib/get-query-client";
import { QUERY_KEY, TOAST_MESSAGE } from "@/shared/model/constants";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";

export const useSignOut = () => {
  const queryClient = getQueryClient();
  const { clearMe } = useAuth();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await signOut();
    },
    onError: (error) => {
      toast.error(TOAST_MESSAGE.AUTH.SIGN_IN.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      clearMe();
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.AUTH.INFO });
      window.location.href = ROUTES.HOME;
      toast.success(TOAST_MESSAGE.AUTH.SIGN_IN.SUCCESS, {
        description: TOAST_MESSAGE.AUTH.SIGN_IN.MESSAGE,
      });
    },
  });
};

"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signOut } from "@/features/auth/api/server";
import {
  AUTH_QUERY_KEY,
  AUTH_TOAST_MESSAGE,
} from "@/features/auth/model/constants";
import { useAuth } from "@/features/auth/model/store";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";

export const useSignOut = () => {
  const queryClient = getQueryClient();
  const { clearMe } = useAuth();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await signOut();
    },
    onError: (error) => {
      toast.error(AUTH_TOAST_MESSAGE.SIGN_OUT.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      clearMe();
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY.INFO });
      window.location.href = ROUTES.HOME;
      toast.success(AUTH_TOAST_MESSAGE.SIGN_OUT.SUCCESS);
    },
  });
};

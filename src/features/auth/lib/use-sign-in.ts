import type { User } from "@supabase/auth-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserInfo } from "@/entities/user/api/server";
import { signInToEntity } from "@/entities/user/lib/mappers";
import type { UserInfo } from "@/entities/user/model/types";
import { signIn } from "@/features/auth/api/client";
import {
  AUTH_QUERY_KEY,
  AUTH_TOAST_MESSAGE,
} from "@/features/auth/model/constants";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";

export const useSignIn = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<User> => {
      return signIn({ email, password });
    },
    onSuccess: () => {
      toast.success(AUTH_TOAST_MESSAGE.SIGN_IN.SUCCESS, {
        description: AUTH_TOAST_MESSAGE.SIGN_IN.MESSAGE,
      });
    },
    onError: (error) => {
      toast.error(AUTH_TOAST_MESSAGE.SIGN_IN.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY.INFO });
    },
  });
};

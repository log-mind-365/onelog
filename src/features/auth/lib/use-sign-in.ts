import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signInToEntity } from "@/entities/user/lib/mappers";
import type { UserInfo } from "@/entities/user/model/types";
import { signIn } from "@/features/auth/api/server";
import { AUTH_QUERY_KEY, AUTH_TOAST_MESSAGE } from "@/features/auth/model/constants";
import { useAuth } from "@/features/auth/model/store";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";

export const useSignIn = () => {
  const queryClient = getQueryClient();
  const { setMe } = useAuth();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<UserInfo> => {
      const result = await signIn({ email, password });
      return signInToEntity(result);
    },
    onSuccess: (data) => {
      setMe(data);
      window.location.href = ROUTES.HOME;
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

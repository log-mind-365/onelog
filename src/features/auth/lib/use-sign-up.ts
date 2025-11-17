import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postUserInfo } from "@/entities/user/api/server";
import { signUpToEntity } from "@/entities/user/lib/mappers";
import type { UserInfo } from "@/entities/user/model/types";
import { signUp } from "@/features/auth/api/client";
import {
  AUTH_QUERY_KEY,
  AUTH_TOAST_MESSAGE,
} from "@/features/auth/model/constants";
import { useAuth } from "@/features/auth/model/store";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";

export const useSignUp = () => {
  const queryClient = getQueryClient();
  const { setMe } = useAuth();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      userName,
    }: {
      email: string;
      password: string;
      userName: string;
    }): Promise<UserInfo | null> => {
      const result = await signUp({
        email,
        password,
        userName,
      });
      const entity = signUpToEntity(result);

      if (!entity) return null;
      const userInfo = await postUserInfo(entity);

      if (!userInfo) return null;
      return userInfo;
    },
    onSuccess: (data) => {
      setMe(data);
      window.location.href = ROUTES.HOME;
      toast.success(AUTH_TOAST_MESSAGE.SIGN_UP.SUCCESS, {
        description: AUTH_TOAST_MESSAGE.SIGN_UP.MESSAGE,
      });
    },
    onError: (error) => {
      toast.error(AUTH_TOAST_MESSAGE.SIGN_UP.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY.INFO });
    },
  });
};

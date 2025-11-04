import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postUserInfo } from "@/entities/user/api/server";
import { signUpToEntity } from "@/entities/user/lib/mappers";
import type { UserInfo } from "@/entities/user/model/types";
import { signUp } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { QUERY_KEY, TOAST_MESSAGE } from "@/shared/model/constants";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";

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
      toast.success(TOAST_MESSAGE.AUTH.SIGN_IN.SUCCESS, {
        description: TOAST_MESSAGE.AUTH.SIGN_IN.MESSAGE,
      });
    },
    onError: (error) => {
      toast.error(TOAST_MESSAGE.AUTH.SIGN_IN.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.AUTH.INFO });
    },
  });
};

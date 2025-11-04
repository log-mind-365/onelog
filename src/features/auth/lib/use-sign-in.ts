import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signInToEntity } from "@/entities/user/lib/mappers";
import type { UserInfo } from "@/entities/user/model/types";
import { signIn } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { QUERY_KEY, TOAST_MESSAGE } from "@/shared/model/constants";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";

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

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { authApi } from "@/entities/auth/auth.api";
import { signUpToEntity } from "@/entities/auth/auth.mapper";
import type { UserInfo } from "@/entities/user/user.model";
import { getQueryClient } from "@/shared/lib/get-query-client";
import { QUERY_KEY, TOAST_MESSAGE } from "@/shared/model/constants";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";

export const signUpSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요"),
    userName: z.string().min(2, "필명은 최소 2자 이상이어야 합니다"),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirmation"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

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
      const result = await authApi.signUp({ email, password, userName });
      return signUpToEntity(result);
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

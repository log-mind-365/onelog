import { z } from "zod";

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

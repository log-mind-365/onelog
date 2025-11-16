import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});
export const signUpSchema = z.object({
  email: z.email("유효한 이메일을 입력해주세요"),
  userName: z.string().min(2, "필명은 최소 2자 이상이어야 합니다"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

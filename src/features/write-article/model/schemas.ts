import { z } from "zod";

export const articleFormSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 작성해주세요.")
    .max(80, "제목이 너무 깁니다."),
  content: z.string().min(1, "내용을 작성해주세요."),
  emotionLevel: z.number().int().min(1).max(5),
  accessType: z.enum(["public", "private"]),
});

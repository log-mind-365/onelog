import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { accessTypes, articles } from "@/db/schemas/articles";

export const articleFormSchema = createInsertSchema(articles, {
  title: (schema) =>
    schema.min(1, "제목을 작성해주세요.").max(80, "제목이 너무 깁니다."),
  content: (schema) => schema.min(1, "내용을 작성해주세요."),
  emotionLevel: (schema) => schema.min(1).max(5),
  accessType: z.enum(accessTypes.enumValues),
}).omit({
  userId: true,
});

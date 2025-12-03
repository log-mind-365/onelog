import type { z } from "zod";
import type { articleFormSchema } from "@/features/write-article/model/schemas";

export type ArticleFormData = z.infer<typeof articleFormSchema>;

import type { articles } from "@/db/schema";
import type { UserInfo } from "@/entities/user/model/types";

export type Article = typeof articles.$inferSelect;
export type ArticleWithAuthorInfo = Article & { author: UserInfo | null };
export type ArticleInsertSchema = typeof articles.$inferInsert;
export type InfiniteArticleList = {
  data: ArticleWithAuthorInfo[];
  previousId?: string;
  nextId?: string;
};
export type AccessType = typeof articles.$inferSelect.accessType;
export type EmotionLevel = typeof articles.$inferSelect.emotionLevel;

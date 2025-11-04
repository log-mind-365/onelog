import type { articles } from "@/db/schema";
import type { UserInfo } from "@/entities/user/user.model";

export type Article = typeof articles.$inferSelect;
export type ArticleWithAuthorInfo = Article & { author: UserInfo | null };
export type ArticleInsertSchema = typeof articles.$inferInsert;
export type InfiniteArticleList = {
  data: ArticleWithAuthorInfo[];
  previousId?: string;
  nextId?: string;
};
export type AccessType = typeof articles.$inferSelect.accessType;

export const PAGE_LIMIT = 10;

export const EMOTION_STATUS = [
  { percent: 0, status: "매우 나쁨" },
  { percent: 25, status: "나쁨" },
  { percent: 50, status: "보통" },
  { percent: 75, status: "좋음" },
  { percent: 100, status: "매우 좋음" },
] as const;

export type EmotionLevel = typeof articles.$inferSelect.emotionLevel;

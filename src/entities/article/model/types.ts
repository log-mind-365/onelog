import type { articleLikes } from "@/db/schemas/article-likes";
import type { articles } from "@/db/schemas/articles";
import type { UserInfo } from "@/entities/user/model/types";

export type Article = typeof articles.$inferSelect;
export type ArticleLike = typeof articleLikes.$inferSelect;
export type ArticleWithAuthorInfo = Article & {
  author: UserInfo | null;
  likeCount: number;
  isLiked: boolean;
  isFollowing: boolean;
  commentCount: number;
};
export type ArticleInsertSchema = typeof articles.$inferInsert;
export type InfiniteArticleList = {
  data: ArticleWithAuthorInfo[];
  previousId?: string;
  nextId?: string;
};
export type AccessType = typeof articles.$inferSelect.accessType;
export type EmotionLevel = typeof articles.$inferSelect.emotionLevel;
export type ArticleViewMode = "viewer" | "author";

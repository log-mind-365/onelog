import type { ArticleViewMode } from "@/entities/article/model/types";

export const useArticleViewMode = (
  authorId: string,
  currentUserId: string | null,
): { viewMode: ArticleViewMode } => {
  const viewMode = currentUserId === authorId ? "author" : "viewer";

  return { viewMode };
};

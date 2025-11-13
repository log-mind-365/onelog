import { useSuspenseQuery } from "@tanstack/react-query";
import type { ArticleViewMode } from "@/entities/article/model/types";
import { followQueries } from "@/entities/follow/api/queries";

export const useArticleViewMode = (
  authorId: string,
  currentUserId: string | null,
): { viewMode: ArticleViewMode; isFollowing: boolean } => {
  const { data: isFollowing } = useSuspenseQuery(
    followQueries.isFollowing(currentUserId, authorId),
  );

  const viewMode = currentUserId === authorId ? "author" : "viewer";

  return { viewMode, isFollowing };
};

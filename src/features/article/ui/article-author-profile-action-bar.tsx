import type { ArticleViewMode } from "@/entities/article/model/types";
import { ArticleOwnerActions } from "@/features/article/ui/article-owner-actions";
import { ArticleVisitorActions } from "@/features/article/ui/article-visitor-actions";

type ArticleAuthorProfileActionBarProps = {
  viewMode: ArticleViewMode;
  authorId: string;
  currentUserId: string | null;
  isFollowing: boolean;
};

export const ArticleAuthorProfileActionBar = ({
  viewMode,
  authorId,
  currentUserId,
  isFollowing,
}: ArticleAuthorProfileActionBarProps) => {
  switch (viewMode) {
    case "viewer":
      return (
        <ArticleVisitorActions
          authorId={authorId}
          currentUserId={currentUserId}
          isFollowing={isFollowing}
        />
      );
    case "author":
      return <ArticleOwnerActions currentUserId={currentUserId ?? ""} />;
  }
};

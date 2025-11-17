import type { ComponentProps } from "react";
import type {
  AccessType,
  ArticleViewMode,
} from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleOptionsDropdownMenu } from "@/entities/article/ui/article-option-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";

import { cn } from "@/shared/lib/helpers/client-helper";

type ArticleFooterProps = ComponentProps<"div"> & {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  accessType: AccessType;
  viewMode: ArticleViewMode;
  onLike: () => void;
  onReport?: () => void;
  onModify?: () => void;
  onDelete?: () => void;
};

export const ArticleFooter = ({
  isLiked,
  likeCount,
  onLike,
  commentCount,
  accessType,
  viewMode,
  onReport,
  onModify,
  onDelete,
  className,
}: ArticleFooterProps) => {
  return (
    <footer className={cn("flex w-full justify-between", className)}>
      <ArticleLikeButton
        likeCount={likeCount}
        isLike={isLiked}
        onClick={onLike}
      />
      <ArticleCommentButton commentCount={commentCount} />
      <ArticleAccessTypeButton value={accessType} readOnly />
      {viewMode === "viewer" && onReport && (
        <ArticleReportButton onClick={onReport} />
      )}
      {viewMode === "author" && onModify && onDelete && (
        <ArticleOptionsDropdownMenu onModify={onModify} onDelete={onDelete} />
      )}
    </footer>
  );
};

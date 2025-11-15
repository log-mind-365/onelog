import type { ComponentProps } from "react";
import type { AccessType, ArticleViewMode } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleOptionsDropdownMenu } from "@/entities/article/ui/article-option-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { cn } from "@/shared/lib/utils";

type ArticleFooterProps = ComponentProps<"div"> & {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  commentCount: number;
  accessType: AccessType;
  viewMode: ArticleViewMode;
  onReport?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
        onClick={(e) => {
          e.stopPropagation();
          onLike();
        }}
      />
      <ArticleCommentButton commentCount={commentCount} />
      <ArticleAccessTypeButton value={accessType} readOnly />
      {viewMode === "viewer" && onReport && (
        <ArticleReportButton
          onClick={(e) => {
            e.stopPropagation();
            onReport(e);
          }}
        />
      )}
      {viewMode === "author" && onModify && onDelete && (
        <ArticleOptionsDropdownMenu
          onModify={onModify}
          onDelete={onDelete}
        />
      )}
    </footer>
  );
};

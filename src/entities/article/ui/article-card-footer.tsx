import type { AccessType } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { CardFooter } from "@/shared/components/ui/card";

type ArticleCardFooterProps = {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  commentCount: number;
  accessType: AccessType;
  onReport: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ArticleCardFooter = ({
  isLiked,
  likeCount,
  onLike,
  commentCount,
  accessType,
  onReport,
}: ArticleCardFooterProps) => {
  return (
    <CardFooter className="flex justify-between">
      <ArticleLikeButton
        likeCount={likeCount}
        isLike={isLiked}
        onClick={(e) => {
          e.stopPropagation();
          onLike();
        }}
      />
      <ArticleCommentButton commentCount={commentCount} />
      <ArticleAccessTypeButton value={accessType} />
      <ArticleReportButton
        onClick={(e) => {
          e.stopPropagation();
          onReport(e);
        }}
      />
    </CardFooter>
  );
};

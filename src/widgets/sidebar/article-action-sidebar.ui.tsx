import type { AccessType } from "@/entities/article/article.model";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleOptionsDropdownMenu } from "@/entities/article/ui/article-option-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { ArticleShareButton } from "@/entities/article/ui/article-share-button";
import { Separator } from "@/shared/components/ui/separator";
import { copyURL } from "@/shared/lib/utils";

type ArticleActionbarProps = {
  likeCount: number;
  isLike: boolean;
  commentCount: number;
  accessType: AccessType;
  isPublic: boolean;
  onDelete: () => void;
  onModify: () => void;
  onReport: () => void;
  onLike: () => void;
};

export const ArticleActionbar = ({
  likeCount = 0,
  isLike = false,
  commentCount = 0,
  accessType,
  onDelete,
  onLike,
  onModify,
  onReport,
}: ArticleActionbarProps) => {
  return (
    <aside className="sticky top-8 left-4 hidden h-fit rounded-md bg-card p-2 shadow-md max-lg:fixed sm:flex">
      <div className="flex flex-col items-center">
        <ArticleLikeButton
          likeCount={likeCount}
          isLike={isLike}
          onClick={onLike}
        />
        <ArticleCommentButton commentCount={commentCount} />
        <Separator />
        <ArticleAccessTypeButton value={accessType} />
        <ArticleShareButton onClick={copyURL} />
        <ArticleReportButton onClick={onReport} />
        <ArticleOptionsDropdownMenu onDelete={onDelete} onModify={onModify} />
      </div>
    </aside>
  );
};

import type { AccessType } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleOptionsDropdownMenu } from "@/entities/article/ui/article-option-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { ShareArticleButton } from "@/features/article/ui/share-article-button";
import { SidebarContainer } from "@/shared/components/sidebar-container";
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

export const ArticleDetailPageSidebar = ({
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
    <SidebarContainer>
      <div className="flex flex-col items-center gap-2">
        <ArticleLikeButton
          likeCount={likeCount}
          isLike={isLike}
          onClick={onLike}
        />
        <ArticleCommentButton commentCount={commentCount} />
        <Separator />
        <ArticleAccessTypeButton value={accessType} />
        <ShareArticleButton onClick={copyURL} />
        <ArticleReportButton onClick={onReport} />
        <ArticleOptionsDropdownMenu onDelete={onDelete} onModify={onModify} />
      </div>
    </SidebarContainer>
  );
};

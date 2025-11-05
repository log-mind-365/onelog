import type { AccessType } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { Card } from "@/shared/components/ui/card";

type ArticleCardContentProps = {
  userId: string;
  isMe: boolean;
  content: string;
  accessType: AccessType;
  onClick: () => void;
};

export const ArticleCardContent = ({
  userId,
  accessType,
  content,
  isMe,
  onClick,
}: ArticleCardContentProps) => {
  return (
    <Card
      onClick={onClick}
      className="w-full cursor-pointer border-0 p-4 transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="relative max-h-64 overflow-hidden">
          <p className="line-clamp-6">{content}</p>
        </div>

        <div className="flex items-center justify-between">
          <ArticleLikeButton
            likeCount={0}
            isLike={false}
            onClick={() => null}
          />
          <ArticleCommentButton commentCount={0} />
          <ArticleAccessTypeButton value={accessType} />
          <ArticleReportButton onClick={() => null} />
        </div>
      </div>
    </Card>
  );
};

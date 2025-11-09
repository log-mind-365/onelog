import type { AccessType } from "@/entities/article/model/types";
import { ArticleCardContent } from "@/entities/article/ui/article-card-content";
import { ArticleCardFooter } from "@/entities/article/ui/article-card-footer";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { Card } from "@/shared/components/ui/card";

type ArticleCardProps = {
  userId: string;
  userName?: string;
  avatarUrl?: string | null;
  email?: string;
  emotionLevel: number;
  isMe: boolean;
  title: string;
  content: string;
  createdAt: Date;
  accessType: AccessType;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  onClick: () => void;
  onLike: () => void;
  onReport: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ArticleCard = ({
  userId,
  userName,
  avatarUrl,
  email,
  emotionLevel,
  isMe,
  title,
  content,
  accessType,
  createdAt,
  likeCount,
  isLiked,
  commentCount,
  onClick,
  onLike,
  onReport,
}: ArticleCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer py-4 shadow-none transition-shadow hover:shadow-lg"
    >
      <ArticleHeader
        userId={userId}
        userName={userName}
        avatarUrl={avatarUrl}
        email={email}
        emotionLevel={emotionLevel}
        isMe={isMe}
        createdAt={createdAt}
      />
      <ArticleCardContent title={title} content={content} />
      <ArticleCardFooter
        isLiked={isLiked}
        likeCount={likeCount}
        onLike={onLike}
        commentCount={commentCount}
        accessType={accessType}
        onReport={onReport}
      />
    </Card>
  );
};

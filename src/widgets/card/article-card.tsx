import type { AccessType } from "@/entities/article/model/types";
import { ArticleCardContent } from "@/widgets/card/article-card-content";
import { ArticleCardHeader } from "@/widgets/card/article-card-header";

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
    <article className="flex flex-col gap-2">
      <ArticleCardHeader
        userId={userId}
        userName={userName}
        avatarUrl={avatarUrl}
        email={email}
        emotionLevel={emotionLevel}
        isMe={isMe}
        createdAt={createdAt}
      />
      <ArticleCardContent
        userId={userId}
        isMe={isMe}
        title={title}
        content={content}
        accessType={accessType}
        likeCount={likeCount}
        isLiked={isLiked}
        commentCount={commentCount}
        onClick={onClick}
        onLike={onLike}
        onReport={onReport}
      />
    </article>
  );
};

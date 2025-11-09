import type { MouseEvent } from "react";
import type { AccessType } from "@/entities/article/model/types";
import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleFooter } from "@/entities/article/ui/article-footer";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";

type ArticleCardProps = {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  email: string;
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
  onReport: (e: MouseEvent<HTMLButtonElement>) => void;
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
    <div className="flex flex-col gap-2">
      <ArticleHeader
        userId={userId}
        userName={userName}
        avatarUrl={avatarUrl}
        email={email}
        emotionLevel={emotionLevel}
        isMe={isMe}
        createdAt={createdAt}
      />
      <Card onClick={onClick} className="cursor-pointer select-none pb-4">
        <CardContent>
          <ArticleContent title={title} content={content} />
        </CardContent>
        <CardFooter>
          <ArticleFooter
            isLiked={isLiked}
            likeCount={likeCount}
            onLike={onLike}
            commentCount={commentCount}
            accessType={accessType}
            onReport={onReport}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

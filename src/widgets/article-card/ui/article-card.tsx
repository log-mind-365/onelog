import type { MouseEvent } from "react";
import type { AccessType } from "@/entities/article/model/types";
import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleFooter } from "@/entities/article/ui/article-footer";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import {
  UserInfoBase,
  UserInfoBaseActions,
} from "@/entities/user/ui/user-info-base";
import { ProfileNavigationButtons } from "@/features/profile/ui/profile-navigation-buttons";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type ArticleCardProps = {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  email: string;
  aboutMe: string;
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
  aboutMe,
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
      <Popover>
        <PopoverTrigger asChild>
          <ArticleHeader
            userName={userName}
            avatarUrl={avatarUrl}
            email={email}
            emotionLevel={emotionLevel}
            createdAt={createdAt}
          />
        </PopoverTrigger>
        <PopoverContent>
          <UserInfoBase
            userName={userName}
            email={email}
            aboutMe={aboutMe}
            avatarUrl={avatarUrl}
          >
            <UserInfoBaseActions>
              <FollowButton
                isFollowing={false}
                isMe={isMe}
                isPending={false}
                onFollow={() => null}
              />
              <ProfileNavigationButtons
                isMe={isMe}
                onViewProfile={() => null}
              />
            </UserInfoBaseActions>
          </UserInfoBase>
        </PopoverContent>
      </Popover>
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

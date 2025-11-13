import type { MouseEvent } from "react";
import type { AccessType } from "@/entities/article/model/types";
import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleFooter } from "@/entities/article/ui/article-footer";
import {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderEmotionGauge,
  ArticleHeaderUserInfo,
} from "@/entities/article/ui/article-header";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import {
  UserInfoCard,
  UserInfoCardAboutMe,
  UserInfoCardActions,
  UserInfoCardAvatar,
  UserInfoCardContent,
  UserInfoCardEmail,
  UserInfoCardName,
} from "@/entities/user/ui/user-info-card";
import { ProfileNavigationButtons } from "@/features/profile/ui/profile-navigation-buttons";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/ui/hover-card";

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
      <ArticleHeader>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button type="button">
              <ArticleHeaderAvatar userName={userName} avatarUrl={avatarUrl} />
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <UserInfoCard>
              <UserInfoCardAvatar userName={userName} avatarUrl={avatarUrl} />
              <UserInfoCardContent>
                <UserInfoCardName userName={userName} />
                <UserInfoCardEmail email={email} />
                <UserInfoCardAboutMe aboutMe={aboutMe} />
              </UserInfoCardContent>
              <UserInfoCardActions>
                <FollowButton
                  isFollowing={false}
                  isPending={false}
                  onFollow={() => null}
                />
                <ProfileNavigationButtons
                  isMe={isMe}
                  onViewProfile={() => null}
                />
              </UserInfoCardActions>
            </UserInfoCard>
          </HoverCardContent>
        </HoverCard>
        <ArticleHeaderUserInfo
          userName={userName}
          email={email}
          createdAt={createdAt}
        />
        <ArticleHeaderEmotionGauge emotionLevel={emotionLevel} />
      </ArticleHeader>
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

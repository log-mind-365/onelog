import type {
  AccessType,
  ArticleViewMode,
} from "@/entities/article/model/types";
import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleFooter } from "@/entities/article/ui/article-footer";
import {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderEmotionGauge,
  ArticleHeaderUserInfo,
} from "@/entities/article/ui/article-header";
import {
  UserInfoCard,
  UserInfoCardAboutMe,
  UserInfoCardActions,
  UserInfoCardAvatar,
  UserInfoCardContent,
  UserInfoCardDetails,
  UserInfoCardEmail,
  UserInfoCardName,
} from "@/entities/user/ui/user-info-card";
import { ArticleAuthorProfileActionBar } from "@/features/article/ui/article-author-profile-action-bar";
import { SizedBox } from "@/shared/components/sized-box";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/ui/hover-card";
import { Separator } from "@/shared/components/ui/separator";

type ArticleCardProps = {
  articleId: number;
  userName: string;
  avatarUrl: string | null;
  email: string;
  aboutMe: string;
  emotionLevel: number;
  title: string;
  content: string;
  createdAt: Date;
  accessType: AccessType;
  likeCount: number;
  authorId: string;
  currentUserId: string | null;
  isLiked: boolean;
  viewMode: ArticleViewMode;
  isFollowing: boolean;
  commentCount: number;
  onClick: () => void;
  onLike: () => void;
  onReport?: () => void;
  onModify?: () => void;
  onDelete?: () => void;
};

export const ArticleCard = ({
  articleId,
  userName,
  avatarUrl,
  email,
  aboutMe,
  isFollowing,
  emotionLevel,
  title,
  authorId,
  currentUserId,
  content,
  accessType,
  viewMode,
  createdAt,
  likeCount,
  isLiked,
  commentCount,
  onClick,
  onLike,
  onReport,
  onModify,
  onDelete,
}: ArticleCardProps) => {
  return (
    <article>
      <Card
        onClick={onClick}
        className="cursor-pointer select-none gap-4 transition-shadow duration-200 ease-in-out hover:shadow-lg"
      >
        <CardHeader>
          <ArticleHeader>
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <ArticleHeaderAvatar
                    userName={userName}
                    avatarUrl={avatarUrl}
                  />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent asChild>
                <UserInfoCard className="flex-col items-center">
                  <UserInfoCardContent className="itmes-center flex-1 flex-col">
                    <UserInfoCardAvatar
                      userName={userName}
                      avatarUrl={avatarUrl}
                      className="flex justify-center"
                    />
                    <UserInfoCardDetails className="flex flex-col items-center">
                      <UserInfoCardName userName={userName} />
                      <UserInfoCardEmail email={email} />
                      <UserInfoCardAboutMe aboutMe={aboutMe} />
                    </UserInfoCardDetails>
                  </UserInfoCardContent>
                  <UserInfoCardActions className="flex-row">
                    <ArticleAuthorProfileActionBar
                      viewMode={viewMode}
                      articleId={articleId}
                      authorId={authorId}
                      currentUserId={currentUserId}
                      isFollowing={isFollowing}
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
        </CardHeader>

        <CardContent>
          <ArticleContent title={title} content={content} />
          <SizedBox size={4} />
          <Separator />
        </CardContent>
        <CardFooter>
          <ArticleFooter
            isLiked={isLiked}
            likeCount={likeCount}
            commentCount={commentCount}
            accessType={accessType}
            viewMode={viewMode}
            onLike={onLike}
            onReport={onReport}
            onModify={onModify}
            onDelete={onDelete}
          />
        </CardFooter>
      </Card>
    </article>
  );
};

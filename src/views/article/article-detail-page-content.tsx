"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { ArticleContent } from "@/entities/article/ui/article-content";
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
import { useArticleViewMode } from "@/features/article/lib/use-article-view-mode";
import { ArticleAuthorProfileActionBar } from "@/features/article/ui/article-author-profile-action-bar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";

type ArticleDetailPageContentProps = {
  currentUserId: string | null;
  articleId: string;
};

export const ArticleDetailPageContent = ({
  currentUserId,
  articleId,
}: ArticleDetailPageContentProps) => {
  const { data: article } = useSuspenseQuery(
    articleQueries.detail(articleId, currentUserId),
  );
  const { viewMode, isFollowing } = useArticleViewMode(
    article.author?.id ?? "",
    currentUserId,
  );

  const {
    id = "",
    userName = "",
    email = "",
    aboutMe = null,
    avatarUrl = null,
  } = article.author ?? {};
  const { title = "", content = "", emotionLevel } = article;

  return (
    <Card>
      <CardHeader>
        <ArticleHeader>
          <ArticleHeaderAvatar userName={userName} avatarUrl={avatarUrl} />
          <ArticleHeaderUserInfo userName={userName} email={email} />
          <ArticleHeaderEmotionGauge emotionLevel={emotionLevel} />
        </ArticleHeader>
      </CardHeader>
      <CardContent>
        <ArticleContent title={title} content={content} />
      </CardContent>
      <CardFooter>
        <UserInfoCard className="flex-col rounded-lg bg-background shadow-md sm:flex-row sm:items-center">
          <UserInfoCardContent className="flex-row">
            <UserInfoCardAvatar userName={userName} avatarUrl={avatarUrl} />
            <UserInfoCardDetails>
              <UserInfoCardName userName={userName} />
              <UserInfoCardEmail email={email} />
              <UserInfoCardAboutMe aboutMe={aboutMe ?? ""} />
            </UserInfoCardDetails>
          </UserInfoCardContent>
          <UserInfoCardActions className="sm:flex-col">
            <ArticleAuthorProfileActionBar
              viewMode={viewMode}
              authorId={id}
              currentUserId={currentUserId}
              isFollowing={isFollowing}
            />
          </UserInfoCardActions>
        </UserInfoCard>
      </CardFooter>
    </Card>
  );
};

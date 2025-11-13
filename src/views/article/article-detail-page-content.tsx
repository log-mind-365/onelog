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
  UserInfoCardEmail,
  UserInfoCardName,
} from "@/entities/user/ui/user-info-card";
import { useArticleViewMode } from "@/features/article/lib/use-article-view-mode";
import { ArticleAuthorProfileSummaryActionBar } from "@/features/article/ui/article-author-profile-summary-action-bar";
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
        <UserInfoCard className="rounded-lg bg-background shadow-md">
          <UserInfoCardAvatar userName={userName} avatarUrl={avatarUrl} />
          <UserInfoCardContent>
            <UserInfoCardName userName={userName} />
            <UserInfoCardEmail email={email} />
            <UserInfoCardAboutMe aboutMe={aboutMe ?? ""} />
          </UserInfoCardContent>
          <UserInfoCardActions>
            <ArticleAuthorProfileSummaryActionBar
              viewMode={viewMode}
              profileUserId={id}
              currentUserId={currentUserId}
              isFollowing={isFollowing}
            />
          </UserInfoCardActions>
        </UserInfoCard>
      </CardFooter>
    </Card>
  );
};

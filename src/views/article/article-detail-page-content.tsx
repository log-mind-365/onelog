"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { articleQueries } from "@/entities/article/api/queries";
import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import {
  UserInfoBase,
  UserInfoBaseActions,
} from "@/entities/user/ui/user-info-base";
import { useFollowToggle } from "@/features/follow/lib/use-follow-toggle";
import { ProfileNavigationButtons } from "@/features/profile/ui/profile-navigation-buttons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ROUTES } from "@/shared/model/routes";

type ArticleDetailPageContentProps = {
  userId: string | null;
  articleId: string;
};

export const ArticleDetailPageContent = ({
  userId,
  articleId,
}: ArticleDetailPageContentProps) => {
  const router = useRouter();
  const { data: article } = useSuspenseQuery(
    articleQueries.detail(articleId, userId),
  );
  useSuspenseQuery(followQueries.stats(article.userId));
  const { mutate: followToggle, isPending: isPendingFollow } =
    useFollowToggle();
  const { data: isFollowing } = useSuspenseQuery(
    followQueries.isFollowing(userId, article.userId),
  );

  const handleNavigateToProfile = () => {
    router.push(ROUTES.PROFILE.VIEW(article.userId));
  };

  const handleNavigateToEditProfile = () => {
    if (article.userId === userId) {
      router.push(ROUTES.ARTICLE.EDIT(articleId));
    }
    return null;
  };

  const handleFollow = () => {
    if (!userId || userId === article.userId) return null;

    followToggle({ followerId: userId, followingId: article.userId });
  };

  return (
    <Card>
      <CardHeader>
        <ArticleHeader
          userName={article.author?.userName ?? ""}
          avatarUrl={article.author?.avatarUrl ?? null}
          email={article.author?.email ?? ""}
          emotionLevel={article.emotionLevel}
          createdAt={article.createdAt}
        />
      </CardHeader>
      <Separator />
      <CardContent>
        <ArticleContent title={article?.title} content={article?.content} />
      </CardContent>
      <CardFooter>
        <UserInfoBase
          userName={article.author?.userName ?? ""}
          email={article.author?.email ?? ""}
          aboutMe={article.author?.aboutMe ?? ""}
          avatarUrl={article.author?.avatarUrl ?? null}
          className="rounded-lg bg-background shadow-md"
        >
          <UserInfoBaseActions>
            <FollowButton
              onFollow={handleFollow}
              isFollowing={isFollowing}
              isMe={userId === article.userId}
              isPending={isPendingFollow}
            />
            <ProfileNavigationButtons
              isMe={article.userId === userId}
              onViewProfile={handleNavigateToProfile}
              onEditProfile={handleNavigateToEditProfile}
            />
          </UserInfoBaseActions>
        </UserInfoBase>
      </CardFooter>
    </Card>
  );
};

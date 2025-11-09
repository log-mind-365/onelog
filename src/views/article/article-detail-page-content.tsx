"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { articleQueries } from "@/entities/article/api/queries";
import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { UserDetailInfo } from "@/entities/user/ui/user-detail-info";
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

  const handleNavigateToProfile = () => {
    router.push(ROUTES.PROFILE.VIEW(article.author?.id ?? ""));
  };

  return (
    <Card>
      <CardHeader>
        <ArticleHeader
          userId={article.author?.id ?? ""}
          userName={article.author?.userName ?? ""}
          avatarUrl={article.author?.avatarUrl ?? null}
          email={article.author?.email ?? ""}
          emotionLevel={article.emotionLevel}
          isMe={article.author?.id === userId}
          createdAt={article.createdAt}
        />
      </CardHeader>
      <Separator />
      <CardContent>
        <ArticleContent title={article?.title} content={article?.content} />
      </CardContent>
      <CardFooter>
        <UserDetailInfo
          userName={article.author?.userName ?? ""}
          email={article.author?.email ?? ""}
          aboutMe={article.author?.aboutMe ?? ""}
          avatarUrl={article.author?.avatarUrl ?? null}
          onProfile={handleNavigateToProfile}
        />
      </CardFooter>
    </Card>
  );
};

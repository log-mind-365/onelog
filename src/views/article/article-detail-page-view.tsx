"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { PageContainer } from "@/shared/components/page-container";
import { Separator } from "@/shared/components/ui/separator";
import { ArticleDetailContent } from "@/views/article/article-detail-content";
import { ArticleCardHeader } from "@/widgets/card/article-card-header";

type ArticleDetailPageView = {
  id: string;
};

export const ArticleDetailPageView = ({ id }: ArticleDetailPageView) => {
  const { data: article } = useSuspenseQuery(articleQueries.detail(id));

  return (
    <PageContainer className="gap-2">
      <ArticleCardHeader
        userId={article?.author?.id ?? ""}
        userName={article?.author?.userName ?? ""}
        avatarUrl={article?.author?.avatarUrl ?? ""}
        email={article?.author?.email ?? ""}
        emotionLevel={article.emotionLevel}
        createdAt={article.createdAt}
        isMe={false}
      />
      <Separator />
      <ArticleDetailContent content={article?.content} />
    </PageContainer>
  );
};

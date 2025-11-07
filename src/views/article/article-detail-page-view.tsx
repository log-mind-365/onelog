"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { useLikeArticle } from "@/features/article/lib/use-like-article";
import { PageContainer } from "@/shared/components/page-container";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/features/auth/model/store";
import { ArticleDetailContent } from "@/views/article/article-detail-content";
import { ArticleDetailPageSidebar } from "@/views/article/article-detail-page-sidebar";
import { ArticleCardHeader } from "@/widgets/card/article-card-header";

type ArticleDetailPageView = {
  id: string;
};

export const ArticleDetailPageView = ({ id }: ArticleDetailPageView) => {
  const { me } = useAuth();
  const { mutate: likeArticle } = useLikeArticle();
  const { data: article } = useSuspenseQuery(
    articleQueries.detail(id, me?.id ?? null),
  );

  const handleLike = () => {
    if (!me?.id) return;
    likeArticle({ articleId: id, userId: me.id });
  };

  return (
    <>
      <ArticleDetailPageSidebar
        likeCount={article.likeCount}
        isLike={article.isLiked}
        commentCount={0}
        accessType={article.accessType}
        isPublic={article.accessType === "public"}
        onLike={handleLike}
        onDelete={() => null}
        onModify={() => null}
        onReport={() => null}
      />
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
    </>
  );
};

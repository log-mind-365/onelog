"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useModal } from "@/app/providers/modal-store";
import { articleQueries } from "@/entities/article/api/queries";
import { useLikeArticle } from "@/features/article/lib/use-like-article";
import { PageContainer } from "@/shared/components/page-container";
import { Separator } from "@/shared/components/ui/separator";
import { ArticleDetailContent } from "@/views/article/article-detail-content";
import { ArticleDetailPageSidebar } from "@/views/article/article-detail-page-sidebar";
import { ArticleCardHeader } from "@/widgets/card/article-card-header";

type ArticleDetailPageView = {
  id: string;
  userId: string | null;
};

export const ArticleDetailPageView = ({
  id,
  userId,
}: ArticleDetailPageView) => {
  const { mutate: likeArticle } = useLikeArticle();
  const { openModal } = useModal();
  const { data: article } = useSuspenseQuery(articleQueries.detail(id, userId));

  const handleLike = () => {
    if (!userId) {
      openModal("auth-guard");
    } else {
      likeArticle({ articleId: id, userId: userId });
    }
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

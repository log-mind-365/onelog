"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useModal } from "@/app/_providers/modal-store";
import { articleQueries } from "@/entities/article/api/queries";
import { useLikeArticle } from "@/features/article/lib/use-like-article";
import { useAuth } from "@/features/auth/model/store";
import { PageContainer } from "@/shared/components/page-container";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { ROUTES } from "@/shared/model/routes";
import { ArticleCommentSection } from "@/views/article/article-comment-section";
import { ArticleDetailContent } from "@/views/article/article-detail-content";
import { ArticleDetailPageActionbar } from "@/views/article/article-detail-page-actionbar";
import { ArticleCardHeader } from "@/widgets/card/article-card-header";

type ArticleDetailPageView = {
  id: string;
  userId: string | null;
};

export const ArticleDetailPageView = ({
  id,
  userId,
}: ArticleDetailPageView) => {
  const { me } = useAuth();
  const router = useRouter();
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

  const handleModify = () => {
    if (!userId) {
      openModal("auth-guard");
    } else if (userId === article?.author?.id) {
      router.push(ROUTES.ARTICLE.EDIT(id));
    }
  };

  return (
    <PageContainer className="flex flex-col gap-4">
      <ArticleDetailPageActionbar
        likeCount={article.likeCount}
        isLike={article.isLiked}
        commentCount={article.commentCount}
        accessType={article.accessType}
        isPublic={article.accessType === "public"}
        onLike={handleLike}
        onDelete={() => null}
        onModify={handleModify}
        onReport={() => null}
      />
      <div className="flex flex-col gap-2 rounded-lg border bg-card p-4">
        <ArticleCardHeader
          userId={article?.author?.id ?? ""}
          userName={article?.author?.userName ?? ""}
          avatarUrl={article?.author?.avatarUrl ?? ""}
          email={article?.author?.email ?? ""}
          emotionLevel={article.emotionLevel}
          createdAt={article.createdAt}
          isMe={userId === article?.author?.id}
        />
        <Separator />
        <ArticleDetailContent
          title={article?.title}
          content={article?.content}
        />
      </div>

      <Suspense fallback={<Spinner />}>
        <ArticleCommentSection
          articleId={id}
          userId={userId}
          userName={me?.userName}
          userAvatar={me?.avatarUrl}
        />
      </Suspense>
    </PageContainer>
  );
};

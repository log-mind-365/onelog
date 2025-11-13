"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/_store/modal-store";
import { articleQueries } from "@/entities/article/api/queries";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleOptionsDropdownMenu } from "@/entities/article/ui/article-option-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { useDeleteArticle } from "@/features/article/lib/use-delete-article";
import { useLikeArticle } from "@/features/article/lib/use-like-article";
import { ShareArticleButton } from "@/features/article/ui/share-article-button";
import { copyURL } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/model/routes";

type ArticleActionbarProps = {
  currentUserId: string | null;
  articleId: string;
};

export const ArticleDetailPageActionbar = ({
  articleId,
  currentUserId,
}: ArticleActionbarProps) => {
  const router = useRouter();
  const { data: article } = useSuspenseQuery(
    articleQueries.detail(articleId, currentUserId),
  );
  const { mutate: likeArticle } = useLikeArticle();
  const { mutate: deleteArticle } = useDeleteArticle();
  const { openModal } = useModal();

  const handleLike = () => {
    if (!currentUserId) {
      openModal("auth-guard");
    } else {
      likeArticle({ articleId, userId: currentUserId });
    }
  };

  const handleModify = () => {
    if (!currentUserId) {
      openModal("auth-guard");
    } else if (currentUserId === article?.author?.id) {
      router.push(ROUTES.ARTICLE.EDIT(articleId));
    }
  };

  const handleReport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!currentUserId) {
      openModal("auth-guard");
    } else {
      openModal("report-article", {
        articleId,
        reporterId: currentUserId,
      });
    }
  };

  const handleDelete = () => {
    if (!currentUserId) {
      openModal("auth-guard");
    } else if (currentUserId === article?.author?.id) {
      const confirmed = window.confirm(
        "정말로 이 게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.",
      );

      if (confirmed) {
        deleteArticle({ articleId });
      }
    }
  };
  return (
    <div className="flex w-full justify-between rounded-lg border-1 bg-card p-2 shadow-sm">
      <ArticleLikeButton
        likeCount={article.likeCount}
        isLike={article.isLiked}
        onClick={handleLike}
      />
      <ArticleCommentButton commentCount={article.commentCount} />
      <ArticleAccessTypeButton value={article.accessType} />
      <ShareArticleButton onClick={copyURL} />
      <ArticleReportButton onClick={handleReport} />
      <ArticleOptionsDropdownMenu
        onDelete={handleDelete}
        onModify={handleModify}
      />
    </div>
  );
};

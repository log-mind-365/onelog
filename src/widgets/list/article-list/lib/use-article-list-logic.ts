import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDeleteArticle } from "@/features/article/lib/use-delete-article";
import { useLikeArticle } from "@/features/like-article/lib/use-like-article";
import { ROUTES } from "@/shared/model/routes";
import { useModal } from "@/shared/store/modal-store";

type UseArticleListLogicParams = {
  currentUserId: string | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export const useArticleListLogic = ({
  currentUserId,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseArticleListLogicParams) => {
  const router = useRouter();
  const { openModal } = useModal();
  const { mutate: likeArticle } = useLikeArticle();
  const { mutate: deleteArticle } = useDeleteArticle();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleLike = (articleId: number) => {
    if (!currentUserId) return null;
    likeArticle({ articleId, currentUserId });
  };

  const handleReport = (articleId: number) => {
    if (!currentUserId) {
      openModal("auth-guard");
    } else {
      openModal("report-article", {
        articleId,
        reporterId: currentUserId,
      });
    }
  };

  const handleModify = (articleId: number) => {
    if (!currentUserId) {
      openModal("auth-guard");
    } else {
      router.push(ROUTES.ARTICLE.EDIT(articleId));
    }
  };

  const handleDelete = (articleId: number) => {
    if (!currentUserId) {
      openModal("auth-guard");
    } else {
      const confirmed = window.confirm(
        "정말로 이 게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.",
      );

      if (confirmed) {
        deleteArticle({ articleId, currentUserId });
      }
    }
  };

  const handleNavigate = (articleId: number) => {
    router.push(ROUTES.ARTICLE.VIEW(articleId));
  };

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    loadMoreRef,
    onLike: handleLike,
    onReport: handleReport,
    onModify: handleModify,
    onDelete: handleDelete,
    onNavigate: handleNavigate,
  };
};

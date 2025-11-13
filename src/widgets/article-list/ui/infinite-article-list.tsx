"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useRef } from "react";
import { useModal } from "@/app/_store/modal-store";
import { articleQueries } from "@/entities/article/api/queries";
import { useLikeArticle } from "@/features/article/lib/use-like-article";
import { useAuth } from "@/features/auth/model/store";
import { ROUTES } from "@/shared/model/routes";
import { ArticleCard } from "@/widgets/article-card/ui/article-card";

export const InfiniteArticleList = () => {
  const router = useRouter();
  const { me } = useAuth();
  const { openModal } = useModal();
  const { mutate: likeArticle } = useLikeArticle();
  const currentUserId = me?.id || null;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(articleQueries.list(currentUserId ?? null));
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

  const handleLike = (articleId: string, userId: string) => {
    if (!currentUserId) return null;
    likeArticle({ articleId, userId });
  };

  const handleReport = (articleId: string) => {
    if (!currentUserId) {
      openModal("auth-guard");
    } else {
      openModal("report-article", {
        articleId,
        reporterId: currentUserId,
      });
    }
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

  if (allArticles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">
          아직 작성된 글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {allArticles.map((article) => {
        const {
          id,
          createdAt,
          title,
          content,
          accessType,
          userId,
          emotionLevel,
          author,
          likeCount,
          isLiked,
          commentCount,
        } = article;
        const isMe = currentUserId === author?.id;

        const onLike = () => handleLike(id, userId);
        const onReport = (e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          handleReport(id);
        };
        return (
          <ArticleCard
            key={id}
            accessType={accessType}
            title={title}
            content={content}
            aboutMe={author?.aboutMe ?? ""}
            isMe={isMe}
            createdAt={createdAt}
            userName={author?.userName ?? ""}
            avatarUrl={author?.avatarUrl ?? null}
            email={author?.email ?? ""}
            emotionLevel={emotionLevel}
            likeCount={likeCount}
            isLiked={isLiked}
            commentCount={commentCount}
            onClick={() => router.push(ROUTES.ARTICLE.VIEW(id))}
            onLike={onLike}
            onReport={onReport}
          />
        );
      })}

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextPage ? (
            <p className="text-muted-foreground text-sm">로딩 중...</p>
          ) : (
            <p className="text-muted-foreground text-sm">더 보기</p>
          )}
        </div>
      )}
    </div>
  );
};

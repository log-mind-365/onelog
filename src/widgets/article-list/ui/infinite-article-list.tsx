"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useRef } from "react";
import { useModal } from "@/app/_store/modal-store";
import { articleQueries } from "@/entities/article/api/queries";
import { useLikeArticle } from "@/features/like-article/lib/use-like-article";
import { ROUTES } from "@/shared/model/routes";
import { ArticleCard } from "@/widgets/article-card/ui/article-card";

type InfiniteArticleListProps = { currentUserId: string | null };

export const InfiniteArticleList = ({
  currentUserId,
}: InfiniteArticleListProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const { mutate: likeArticle } = useLikeArticle();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(articleQueries.publicList(currentUserId ?? null));
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

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
          isFollowing,
          isLiked,
          commentCount,
        } = article;
        const viewMode = userId === currentUserId ? "author" : "viewer";

        const onLike = () => handleLike(id);
        const onReport = (e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          handleReport(id);
        };
        return (
          <ArticleCard
            key={id}
            articleId={id}
            accessType={accessType}
            title={title}
            content={content}
            aboutMe={author?.aboutMe ?? ""}
            createdAt={createdAt}
            userName={author?.userName ?? ""}
            avatarUrl={author?.avatarUrl ?? null}
            email={author?.email ?? ""}
            emotionLevel={emotionLevel}
            authorId={userId}
            currentUserId={currentUserId}
            likeCount={likeCount}
            viewMode={viewMode}
            isFollowing={isFollowing}
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

"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { InfiniteArticleList as InfiniteArticleListType } from "@/entities/article/model/types";
import { ROUTES } from "@/shared/model/routes";
import { ArticleCard } from "@/widgets/card/article-card";

type InfiniteArticleListProps = {
  data: InfiniteData<InfiniteArticleListType>;
  currentUserId: string | null;
  onLike: (articleId: string, userId: string) => void;
  onReport: (
    articleId: string,
    reporterId: string,
  ) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const InfiniteArticleList = ({
  data,
  currentUserId,
  onLike,
  onReport,
  onFetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteArticleListProps) => {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onFetchNextPage();
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
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

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

        const handleLike = () => {
          if (!currentUserId) return;
          onLike(id, currentUserId);
        };

        const handleReport = (e: React.MouseEvent<HTMLButtonElement>) => {
          if (!currentUserId) return;
          onReport(id, currentUserId)(e);
        };

        return (
          <ArticleCard
            key={id}
            accessType={accessType}
            title={title}
            content={content}
            isMe={isMe}
            createdAt={createdAt}
            userId={userId}
            userName={author?.userName}
            avatarUrl={author?.avatarUrl}
            email={author?.email}
            emotionLevel={emotionLevel}
            likeCount={likeCount}
            isLiked={isLiked}
            commentCount={commentCount}
            onClick={() => router.push(ROUTES.ARTICLE.VIEW(id))}
            onLike={handleLike}
            onReport={handleReport}
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

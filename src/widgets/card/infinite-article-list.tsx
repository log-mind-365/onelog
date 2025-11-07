"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { InfiniteArticleList as InfiniteArticleListType } from "@/entities/article/model/types";
import { ROUTES } from "@/shared/model/routes";
import { ArticleCard } from "@/widgets/card/article-card";

type InfiniteArticleListProps = {
  data: InfiniteData<InfiniteArticleListType>;
  currentUserId: string | null;
  onLike: (articleId: string, userId: string) => void;
  onFetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const InfiniteArticleList = ({
  data,
  currentUserId,
  onLike,
  onFetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteArticleListProps) => {
  const router = useRouter();

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

  const parentRef = useRef<HTMLUListElement>(null);

  const articleVirtualizer = useVirtualizer({
    count: hasNextPage ? allArticles.length + 1 : allArticles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 10,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const [lastItem] = [...articleVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allArticles.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      onFetchNextPage();
    }
  }, [
    hasNextPage,
    onFetchNextPage,
    allArticles.length,
    isFetchingNextPage,
    articleVirtualizer.getVirtualItems(),
  ]);

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
    <ul ref={parentRef} className="flex h-full flex-col gap-8">
      {articleVirtualizer.getVirtualItems().map((virtualRow) => {
        const article = allArticles[virtualRow.index];

        if (!article) return null;
        const {
          id,
          createdAt,
          content,
          accessType,
          userId,
          emotionLevel,
          author,
          likeCount,
          isLiked,
        } = article;
        const isMe = currentUserId === author?.id;

        const handleLike = () => {
          if (!currentUserId) return;
          onLike(id, currentUserId);
        };

        return (
          <li key={id}>
            <ArticleCard
              accessType={accessType}
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
              onClick={() => router.push(ROUTES.ARTICLE.VIEW(id))}
              onLike={handleLike}
            />
          </li>
        );
      })}
    </ul>
  );
};

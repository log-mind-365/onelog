"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { articleQueries } from "@/entities/article/article.queries";
import { useAuth } from "@/shared/store/use-auth";
import { ArticleCard } from "@/widgets/card/article-card.widget";

export const InfiniteArticleList = () => {
  const { me } = useAuth();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(articleQueries.infinite());

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
      void fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allArticles.length,
    isFetchingNextPage,
    articleVirtualizer.getVirtualItems(),
  ]);

  return (
    <ul ref={parentRef}>
      {articleVirtualizer.getVirtualItems().map((virtualRow) => {
        const article = allArticles[virtualRow.index];
        const {
          id,
          createdAt,
          content,
          accessType,
          userId,
          emotionLevel,
          author,
        } = article;
        const isMe = me?.id === author?.id;
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
              onClick={() => null}
            />
          </li>
        );
      })}
    </ul>
  );
};

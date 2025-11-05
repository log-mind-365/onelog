"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";
import { ArticleCard } from "@/widgets/card/article-card";

export const InfiniteArticleList = () => {
  const { me } = useAuth();
  const router = useRouter();
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
              onClick={() => router.push(ROUTES.ARTICLE.VIEW(id))}
            />
          </li>
        );
      })}
    </ul>
  );
};

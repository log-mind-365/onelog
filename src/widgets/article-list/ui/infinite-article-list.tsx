"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { EmptyArticle } from "@/features/profile/ui/empty-article";
import { Empty, EmptyHeader, EmptyMedia } from "@/shared/components/ui/empty";
import { Spinner } from "@/shared/components/ui/spinner";
import { ArticleCard } from "@/widgets/article-card/ui/article-card";
import { useArticleListLogic } from "@/widgets/article-list/lib/use-article-list-logic";

type InfiniteArticleListProps = {
  currentUserId: string | null;
};

export const InfiniteArticleList = ({
  currentUserId,
}: InfiniteArticleListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(articleQueries.publicList(currentUserId ?? null));
  const { loadMoreRef, onLike, onModify, onDelete, onNavigate, onReport } =
    useArticleListLogic({
      currentUserId,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    });

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

  if (allArticles.length === 0) {
    return <EmptyArticle description="첫 게시물을 작성해 보세요." />;
  }

  return (
    <section className="flex flex-col gap-8">
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
            onClick={() => onNavigate(id)}
            onLike={() => onLike(id)}
            onReport={viewMode === "viewer" ? () => onReport(id) : undefined}
            onModify={viewMode === "author" ? () => onModify(id) : undefined}
            onDelete={viewMode === "author" ? () => onDelete(id) : undefined}
          />
        );
      })}

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextPage && <Spinner className="w-full" />}
        </div>
      )}
    </section>
  );
};

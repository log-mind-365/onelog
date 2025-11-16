"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { ArticleCard } from "@/widgets/article-card/ui/article-card";
import { useArticleListLogic } from "@/widgets/article-list/lib/use-article-list-logic";

type InfiniteArticleListProps = { currentUserId: string | null };

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
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">
          아직 작성된 글이 없습니다.
        </p>
      </div>
    );
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
          {isFetchingNextPage ? (
            <p className="text-muted-foreground text-sm">로딩 중...</p>
          ) : (
            <p className="text-muted-foreground text-sm">더 보기</p>
          )}
        </div>
      )}
    </section>
  );
};

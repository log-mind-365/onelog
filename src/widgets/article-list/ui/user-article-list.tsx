"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { Empty, EmptyHeader } from "@/shared/components/ui/empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArticleCard } from "@/widgets/article-card/ui/article-card";
import { useArticleListLogic } from "../lib/use-article-list-logic";

type UserArticleListProps = {
  userId: string;
  currentUserId: string | null;
  accessType?: "public" | "private";
};

export const UserArticleList = ({
  userId,
  currentUserId,
  accessType,
}: UserArticleListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      articleQueries.userArticles(userId, currentUserId, accessType),
    );

  const { loadMoreRef, onLike, onModify, onDelete, onNavigate, onReport } =
    useArticleListLogic({
      currentUserId,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    });

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (allArticles.length === 0) {
    return (
      <Empty>
        <EmptyHeader>뭘봐 시발아</EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {allArticles.map((article) => {
        const {
          id,
          createdAt,
          title,
          content,
          accessType,
          userId: authorId,
          emotionLevel,
          author,
          likeCount,
          isFollowing,
          isLiked,
          commentCount,
        } = article;
        const viewMode = authorId === currentUserId ? "author" : "viewer";

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
            authorId={authorId}
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
    </div>
  );
};

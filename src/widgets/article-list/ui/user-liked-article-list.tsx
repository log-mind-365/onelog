"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { EmptyArticle } from "@/features/profile/ui/empty-article";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";
import { ArticleCard } from "@/widgets/article-card/ui/article-card";
import { useArticleListLogic } from "../lib/use-article-list-logic";

type UserLikedArticleListProps = {
  userId: string;
  currentUserId: string | null;
};

export const UserLikedArticleList = ({
  userId,
  currentUserId,
}: UserLikedArticleListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(articleQueries.userLikedArticles(userId, currentUserId));

  const { loadMoreRef, onLike, onModify, onDelete, onNavigate, onReport } =
    useArticleListLogic({
      currentUserId,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    });

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return <Spinner className="w-full" />;
  }

  if (allArticles.length === 0) {
    return (
      <EmptyArticle
        title="아직 좋아요한 글이 없어요."
        description="좋아요를 추가해 보세요."
      />
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

import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  checkUserLiked,
  getArticleDetail,
  getArticleLikeCount,
  getInfinitePublicArticleList,
} from "@/entities/article/api/server";
import { ARTICLE_QUERY_KEY } from "@/entities/article/model/constants";
import type { InfiniteArticleList } from "@/entities/article/model/types";

export const articleQueries = {
  publicList: (currentUserId: string | null) =>
    infiniteQueryOptions({
      queryKey: ARTICLE_QUERY_KEY.PUBLIC(currentUserId),
      queryFn: async ({ pageParam }): Promise<InfiniteArticleList> =>
        getInfinitePublicArticleList(pageParam ?? 0, currentUserId),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),
  privateList: (currentUserId: string) =>
    infiniteQueryOptions({
      queryKey: ARTICLE_QUERY_KEY.PRIVATE(currentUserId),
      queryFn: async ({ pageParam }): Promise<InfiniteArticleList> =>
        getInfinitePublicArticleList(pageParam ?? 0, currentUserId),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),
  detail: (articleId: number, currentUserId: string | null) =>
    queryOptions({
      queryKey: ARTICLE_QUERY_KEY.DETAIL(articleId, currentUserId),
      queryFn: async () => getArticleDetail(articleId, currentUserId),
      enabled: !!articleId,
    }),
  likeCount: (articleId: number) =>
    queryOptions({
      queryKey: ARTICLE_QUERY_KEY.LIKE_COUNT(articleId),
      queryFn: async () => getArticleLikeCount(articleId),
    }),
  isLiked: (articleId: number, userId: string | null) =>
    queryOptions({
      queryKey: ARTICLE_QUERY_KEY.CHECK_LIKED(Number(articleId), userId),
      queryFn: async () => checkUserLiked(articleId, userId),
      enabled: !!userId,
    }),
};

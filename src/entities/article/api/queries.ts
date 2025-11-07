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
  infinite: (userId?: string | null) =>
    infiniteQueryOptions({
      queryKey: ARTICLE_QUERY_KEY.PUBLIC,
      queryFn: async ({ pageParam }): Promise<InfiniteArticleList> =>
        getInfinitePublicArticleList(pageParam, userId),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),
  detail: (id: string, userId?: string | null) =>
    queryOptions({
      queryKey: ARTICLE_QUERY_KEY.DETAIL(id, userId),
      queryFn: async () => getArticleDetail(id, userId),
    }),
  likeCount: (articleId: string) =>
    queryOptions({
      queryKey: ARTICLE_QUERY_KEY.LIKE_COUNT(articleId),
      queryFn: async () => getArticleLikeCount(articleId),
    }),
  isLiked: (articleId: string, userId: string | null) =>
    queryOptions({
      queryKey: ARTICLE_QUERY_KEY.CHECK_LIKED(Number(articleId), userId),
      queryFn: async () => checkUserLiked(articleId, userId),
      enabled: !!userId,
    }),
};

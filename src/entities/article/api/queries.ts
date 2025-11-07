import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  checkUserLiked,
  getArticleDetail,
  getArticleLikeCount,
  getInfinitePublicArticleList,
} from "@/entities/article/api/server";
import type { InfiniteArticleList } from "@/entities/article/model/types";
import { QUERY_KEY } from "@/shared/model/constants";

export const articleQueries = {
  infinite: (userId?: string | null) =>
    infiniteQueryOptions({
      queryKey: [...QUERY_KEY.ARTICLE.PUBLIC],
      queryFn: async ({ pageParam }): Promise<InfiniteArticleList> =>
        getInfinitePublicArticleList(pageParam, userId),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),
  detail: (id: string, userId?: string | null) =>
    queryOptions({
      queryKey: [...QUERY_KEY.ARTICLE.DETAIL(id), userId],
      queryFn: async () => getArticleDetail(id, userId),
    }),
  likeCount: (articleId: string) =>
    queryOptions({
      queryKey: ["article", "likeCount", articleId],
      queryFn: async () => getArticleLikeCount(articleId),
    }),
  isLiked: (articleId: string, userId: string | null) =>
    queryOptions({
      queryKey: QUERY_KEY.ARTICLE.CHECK_LIKED(Number(articleId), userId),
      queryFn: async () => checkUserLiked(articleId, userId),
      enabled: !!userId,
    }),
};

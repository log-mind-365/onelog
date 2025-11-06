import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  getArticleDetail,
  getInfinitePublicArticleList,
} from "@/entities/article/api/server";
import type { InfiniteArticleList } from "@/entities/article/model/types";
import { QUERY_KEY } from "@/shared/model/constants";

export const articleQueries = {
  infinite: () =>
    infiniteQueryOptions({
      queryKey: QUERY_KEY.ARTICLE.PUBLIC,
      queryFn: async ({ pageParam }): Promise<InfiniteArticleList> =>
        getInfinitePublicArticleList(pageParam),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: QUERY_KEY.ARTICLE.DETAIL(id),
      queryFn: async () => getArticleDetail(id),
    }),
};

import { infiniteQueryOptions } from "@tanstack/react-query";
import { getInfinitePublicArticleList } from "@/entities/article/article.api";
import type { InfiniteArticleList } from "@/entities/article/article.model";
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
};

import { queryOptions } from "@tanstack/react-query";
import { getCommentCount, getComments } from "@/entities/comment/api/server";
import { COMMENT_QUERY_KEY } from "@/entities/comment/model/constants";

export const commentQueries = {
  list: (articleId: number) =>
    queryOptions({
      queryKey: COMMENT_QUERY_KEY.LIST(articleId),
      queryFn: async () => getComments(articleId),
    }),
  count: (articleId: number) =>
    queryOptions({
      queryKey: COMMENT_QUERY_KEY.COUNT(articleId),
      queryFn: async () => getCommentCount(articleId),
    }),
};

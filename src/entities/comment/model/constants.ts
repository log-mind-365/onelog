export const COMMENT_QUERY_KEY = {
  LIST: (articleId: string) => ["comments", "list", articleId],
  DETAIL: (commentId: string) => ["comments", "detail", commentId],
  COUNT: (articleId: string) => ["comments", "count", articleId],
};

export const COMMENT_QUERY_KEY = {
  LIST: (articleId: number) => ["comments", "list", articleId],
  DETAIL: (commentId: number) => ["comments", "detail", commentId],
  COUNT: (articleId: number) => ["comments", "count", articleId],
};

export const COMMENT_TOAST_MESSAGE = {
  DELETE: {
    SUCCESS: "댓글 삭제에 성공했습니다.",
    EXCEPTION: "댓글 삭제에 실패했습니다.",
  },
  POST: {
    SUCCESS: "댓글 생성에 성공했습니다.",
    EXCEPTION: "댓글 생성에 실패했습니다.",
  },
  UPDATE: {
    SUCCESS: "댓글 수정에 성공했습니다.",
    EXCEPTION: "댓글 수정에 실패했습니다.",
  },
};

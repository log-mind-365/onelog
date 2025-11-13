export const ARTICLE_PAGE_LIMIT = 10;

export const EMOTION_STATUS = [
  { percent: 0, status: "매우 나쁨" },
  { percent: 25, status: "나쁨" },
  { percent: 50, status: "보통" },
  { percent: 75, status: "좋음" },
  { percent: 100, status: "매우 좋음" },
] as const;

export const EMOTION_LABELS: Record<number, string> = {
  1: "매우 나쁨",
  2: "나쁨",
  3: "보통",
  4: "좋음",
  5: "매우 좋음",
};

export const EMOTION_PERCENT_COLORS: Record<number, string> = {
  0: "bg-red-300",
  25: "bg-blue-400",
  50: "bg-yellow-400",
  75: "bg-green-700",
  100: "bg-green-400",
};

export const ARTICLE_TOAST_MESSAGE = {
  POST: {
    SUCCESS: "게시물 업로드에 성공했습니다.",
    EXCEPTION: "게시물 업로드에 실패했습니다.",
  },
  UPDATE: {
    SUCCESS: "게시물 수정에 성공했습니다.",
    EXCEPTION: "게시물 업로드에 실패했습니다.",
  },
  DELETE: {
    SUCCESS: "게시물 삭제에 성공했습니다.",
    EXCEPTION: "게시물 삭제에 실패했습니다.",
  },
  LIKE: {
    SUCCESS: "좋아요한 글은 프로필에서 다시 볼 수 있어요.",
    CANCEL: "좋아요를 취소했습니다.",
    EXCEPTION: "좋아요 처리 중 오류가 발생했습니다.",
  },
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

export const ARTICLE_QUERY_KEY = {
  PUBLIC: ["all_post"],
  LIKED: (authorId?: string | null, meId?: string | null) => [
    "post",
    "liked",
    authorId,
    meId,
  ],
  THAT_DAY: (
    startOfDay?: string | null,
    endOfDay?: string | null,
    authorId?: string | null,
  ) => ["post", startOfDay, endOfDay, authorId],
  ARTICLE_TYPE: (
    postType?: "journal" | "article",
    authorId?: string | null,
  ) => ["post", postType, authorId],
  DETAIL: (postId: string, currentUserId?: string | null) => [
    "post",
    postId,
    currentUserId,
  ],
  LIKE_COUNT: (articleId: string) => ["article", "likeCount", articleId],
  CHECK_LIKED: (postId?: number, meId?: string | null) => [
    "post",
    "isLiked",
    postId,
    meId,
  ],

  COUNT: {
    LIKED: (userId: string) => ["count", "post", userId],
    TOTAL: (userId: string) => ["count", "allPost", userId],
    POST_TYPE: (userId: string, postType?: "journal" | "article") => [
      "count",
      "post",
      postType,
      userId,
    ],
  },
};

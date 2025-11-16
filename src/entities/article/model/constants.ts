export const ARTICLE_PAGE_LIMIT = 10;

export const EMOTION_STATUS = [
  { level: 1, status: "매우 나쁨" },
  { level: 2, status: "나쁨" },
  { level: 3, status: "보통" },
  { level: 4, status: "좋음" },
  { level: 5, status: "매우 좋음" },
] as const;

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

export const ARTICLE_QUERY_KEY = {
  PUBLIC: (currentUserId: string | null) => ["all_post", currentUserId],
  PRIVATE: (currentUserId: string | null) => ["my_post", currentUserId],
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
  DETAIL: (articleId: number, currentUserId?: string | null) => [
    "post",
    articleId,
    currentUserId,
  ],
  LIKE_COUNT: (articleId: number) => ["article", "likeCount", articleId],
  CHECK_LIKED: (articleId?: number, meId?: string | null) => [
    "post",
    "isLiked",
    articleId,
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
  EMOTION_ACTIVITY: (userId: string) => ["emotion", "activity", userId],
  USER_ARTICLES: (
    userId: string,
    currentUserId: string | null,
    accessType?: "public" | "private",
  ) => ["user", "articles", userId, currentUserId, accessType],
  USER_LIKED_ARTICLES: (userId: string, currentUserId: string | null) => [
    "user",
    "liked",
    "articles",
    userId,
    currentUserId,
  ],
};

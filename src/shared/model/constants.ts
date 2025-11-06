export const TOAST_MESSAGE = {
  AUTH: {
    SIGN_IN: {
      SUCCESS: "로그인에 성공했습니다.",
      EXCEPTION: "로그인에 실패했습니다.",
      MESSAGE: "환영합니다.",
    },
    SIGN_UP: {
      SUCCESS: "회원가입에 성공했습니다.",
      EXCEPTION: "회원가입에 실패했습니다.",
      MESSAGE: "환영합니다",
    },
    SIGN_OUT: {
      SUCCESS: "로그아웃에 성공했습니다.",
      EXCEPTION: "로그아웃에 실패했습니다.",
    },
  },

  USER_INFO: {
    EDIT: {
      SUCCESS: "정보 수정에 성공했습니다.",
      EXCEPTION: "정보 수정에 실패했습니다.",
    },
    UPLOAD_AVATAR: {
      EXCEPTION: "이미지 변경중 문제가 발생했습니다.",
      OVER_SIZE: "이미지 파일 크기는 5MB 이하만 가능합니다.",
      WRONG_TYPE: "이미지 파일만 업로드 가능합니다.",
    },
  },

  COMMENT: {
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
  },

  ARTICLE: {
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
  },

  SHARE: {
    CLIPBOARD: "주소가 복사되었습니다.",
  },
};

export const QUERY_KEY = {
  AUTH: {
    SESSION: ["me", "session"],
    INFO: ["me", "info"],
  },

  USER: {
    INFO: (userId: string) => ["user", "info", userId],
  },

  ARTICLE: {
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
    DETAIL: (postId?: string) => ["post", postId],
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
  },
};

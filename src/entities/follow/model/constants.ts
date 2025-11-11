export const FOLLOW_QUERY_KEY = {
  FOLLOWER_COUNT: (userId: string) => ["follow", "follower-count", userId],
  FOLLOWING_COUNT: (userId: string) => ["follow", "following-count", userId],
  IS_FOLLOWING: (followerId: string | null, followingId: string) => [
    "follow",
    "status",
    followerId,
    followingId,
  ],
  FOLLOWERS: (userId: string) => ["follow", "followers", userId],
  FOLLOWING: (userId: string) => ["follow", "following", userId],
  STATS: (userId: string) => ["follow", "stats", userId],
} as const;

export const FOLLOW_TOAST_MESSAGE = {
  FOLLOW: {
    SUCCESS: "팔로우했습니다.",
    EXCEPTION: "팔로우 처리 중 오류가 발생했습니다.",
  },
  UNFOLLOW: {
    SUCCESS: "언팔로우했습니다.",
    EXCEPTION: "언팔로우 처리 중 오류가 발생했습니다.",
  },
} as const;

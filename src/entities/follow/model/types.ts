import type { profiles } from "@/db/schemas/profiles";
import type { userFollows } from "@/db/schemas/user-follows";

export type Follow = typeof userFollows.$inferSelect;
export type FollowInsertSchema = typeof userFollows.$inferInsert;

export type FollowerWithProfile = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower: typeof profiles.$inferSelect;
};

export type FollowingWithProfile = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  following: typeof profiles.$inferSelect;
};

export type FollowStats = {
  followerCount: number;
  followingCount: number;
};

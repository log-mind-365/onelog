"use server";

import { and, count, desc, eq, getTableColumns, gt } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schemas/profiles";
import { userFollows } from "@/db/schemas/user-follows";
import { FOLLOWER_PAGE_LIMIT } from "@/entities/user/model/constants";

export const getFollowerCount = async (userId: string): Promise<number> => {
  return db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followingId, userId))
    .then((rows) => rows[0].count);
};

export const getFollowingCount = async (userId: string): Promise<number> => {
  return db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followerId, userId))
    .then((rows) => rows[0].count);
};

export const checkIsFollowing = async (
  followerId: string | null,
  followingId: string,
) => {
  if (!followerId) return false;
  if (followerId === followingId) return false;
  return db
    .select()
    .from(userFollows)
    .where(
      and(
        eq(userFollows.followingId, followingId),
        eq(userFollows.followerId, followerId),
      ),
    )
    .then((rows) => rows.length > 0);
};

export const getFollowStats = async (userId: string) => {
  const [followerCount, followingCount] = await Promise.all([
    getFollowerCount(userId),
    getFollowingCount(userId),
  ]);

  return {
    followerCount,
    followingCount,
    isFollowing: await checkIsFollowing(userId, userId),
  };
};

export const getFollowers = async (pageParam: string, userId: string) => {
  const result = await db
    .select({
      ...getTableColumns(userFollows),
      profile: profiles,
    })
    .from(userFollows)
    .leftJoin(profiles, eq(userFollows.followerId, profiles.id))
    .where(
      and(
        pageParam ? gt(userFollows.id, pageParam) : undefined,
        eq(userFollows.followingId, userId),
      ),
    )
    .limit(FOLLOWER_PAGE_LIMIT)
    .orderBy(desc(userFollows.createdAt))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        profile: row.profile,
      })),
    );

  const nextId =
    result.length === FOLLOWER_PAGE_LIMIT
      ? result[FOLLOWER_PAGE_LIMIT - 1].id
      : undefined;
  const previousId = result.length > 0 ? result[0].id : undefined;

  return {
    nextId,
    previousId,
    data: result,
  };
};

export const getFollowing = async (pageParam: string, userId: string) => {
  const result = await db
    .select({
      ...getTableColumns(userFollows),
      profile: profiles,
    })
    .from(userFollows)
    .leftJoin(profiles, eq(userFollows.followingId, profiles.id))
    .where(
      and(
        pageParam ? gt(userFollows.id, pageParam) : undefined,
        eq(userFollows.followingId, userId),
      ),
    )
    .limit(FOLLOWER_PAGE_LIMIT)
    .orderBy(desc(userFollows.createdAt))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        profile: row.profile,
      })),
    );

  const nextId =
    result.length === FOLLOWER_PAGE_LIMIT
      ? result[FOLLOWER_PAGE_LIMIT - 1].id
      : undefined;
  const previousId = result.length > 0 ? result[0].id : undefined;

  return {
    nextId,
    previousId,
    data: result,
  };
};

export const toggleFollow = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new Error("자기 자신을 팔로우할 수 없습니다.");
  }

  const existingFollow = await db
    .select()
    .from(userFollows)
    .where(
      and(
        eq(userFollows.followingId, followingId),
        eq(userFollows.followerId, followerId),
      ),
    )
    .then((rows) => rows[0]);

  if (!existingFollow) {
    await db.insert(userFollows).values({
      followerId,
      followingId,
    });
  } else {
    await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followingId, followingId),
          eq(userFollows.followerId, followerId),
        ),
      );
  }
};

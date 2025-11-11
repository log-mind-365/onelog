import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  checkIsFollowing,
  getFollowerCount,
  getFollowers,
  getFollowing,
  getFollowingCount,
  getFollowStats,
} from "@/entities/follow/api/server";
import { FOLLOW_QUERY_KEY } from "@/entities/follow/model/constants";

export const followQueries = {
  followers: (userId: string) =>
    infiniteQueryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWERS(userId),
      queryFn: ({ pageParam }) => getFollowers(pageParam, userId),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),
  following: (userId: string) =>
    infiniteQueryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWING(userId),
      queryFn: ({ pageParam }) => getFollowing(pageParam, userId),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),
  followerCount: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWER_COUNT(userId),
      queryFn: () => getFollowerCount(userId),
    }),
  followingCount: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWING_COUNT(userId),
      queryFn: () => getFollowingCount(userId),
    }),
  isFollowing: (followerId: string, followingId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.IS_FOLLOWING(followerId, followingId),
      queryFn: () => checkIsFollowing(followerId, followingId),
    }),
  stats: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.STATS(userId),
      queryFn: () => getFollowStats(userId),
    }),
};

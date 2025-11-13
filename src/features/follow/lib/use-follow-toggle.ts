import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ARTICLE_QUERY_KEY } from "@/entities/article/model/constants";
import { toggleFollow } from "@/entities/follow/api/server";
import {
  FOLLOW_QUERY_KEY,
  FOLLOW_TOAST_MESSAGE,
} from "@/entities/follow/model/constants";
import type {
  FollowInsertSchema,
  FollowStats,
} from "@/entities/follow/model/types";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";

export const useFollowToggle = (articleId?: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (params: FollowInsertSchema) => toggleFollow(params),
    onMutate: async (params: FollowInsertSchema) => {
      const queryKeys = [
        FOLLOW_QUERY_KEY.STATS(params.followingId),
        FOLLOW_QUERY_KEY.IS_FOLLOWING(params.followerId, params.followingId),
      ];
      await Promise.all(
        queryKeys.map((key) => queryClient.cancelQueries({ queryKey: key })),
      );

      const previousStats = queryClient.getQueryData<FollowStats>(
        FOLLOW_QUERY_KEY.STATS(params.followingId),
      );
      const previousIsFollowing = queryClient.getQueryData<boolean>(
        FOLLOW_QUERY_KEY.IS_FOLLOWING(params.followerId, params.followingId),
      );
      queryClient.setQueryData(
        FOLLOW_QUERY_KEY.IS_FOLLOWING(params.followerId, params.followingId),
        (old) => !old,
      );
      queryClient.setQueryData<FollowStats>(
        FOLLOW_QUERY_KEY.STATS(params.followingId),
        (old) => {
          const stats = old ?? previousStats;
          if (!stats) {
            return undefined;
          }

          return {
            ...stats,
            followerCount: stats.followerCount + (previousIsFollowing ? -1 : 1),
          };
        },
      );

      return { previousStats, previousIsFollowing };
    },
    onSuccess: async (data, variables) => {
      const { followerId, followingId } = variables;
      const { isFollowed } = data;

      const queryKeys = [
        ARTICLE_QUERY_KEY.PUBLIC,
        articleId ? ARTICLE_QUERY_KEY.DETAIL(articleId, followerId) : undefined,
        FOLLOW_QUERY_KEY.STATS(followingId),
        FOLLOW_QUERY_KEY.IS_FOLLOWING(followerId, followingId),
      ];

      await Promise.all(
        queryKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        ),
      );

      if (isFollowed) {
        toast.success(FOLLOW_TOAST_MESSAGE.FOLLOW.SUCCESS);
      } else {
        toast.success(FOLLOW_TOAST_MESSAGE.UNFOLLOW.SUCCESS);
      }
    },
    onError: (error, variables, onMutateResult, context) => {
      console.error(error);
      toast.error(FOLLOW_TOAST_MESSAGE.FOLLOW.EXCEPTION, {
        description: error.message,
      });
      queryClient.setQueryData(
        FOLLOW_QUERY_KEY.STATS(variables.followingId),
        onMutateResult?.previousStats,
      );
      queryClient.setQueryData(
        FOLLOW_QUERY_KEY.IS_FOLLOWING(
          variables.followerId,
          variables.followingId,
        ),
        onMutateResult?.previousIsFollowing,
      );
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollow } from "@/entities/follow/api/server";
import { FOLLOW_QUERY_KEY } from "@/entities/follow/model/constants";
import type { FollowInsertSchema } from "@/entities/follow/model/types";

export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: FollowInsertSchema) => toggleFollow(params),
    onSuccess: (_, variables) => {
      const { followerId, followingId } = variables;
      const queryKeys = [
        FOLLOW_QUERY_KEY.STATS(followingId),
        FOLLOW_QUERY_KEY.IS_FOLLOWING(followerId, followingId),
      ];
      queryKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

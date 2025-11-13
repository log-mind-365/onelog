import { useSuspenseQuery } from "@tanstack/react-query";
import { followQueries } from "@/entities/follow/api/queries";
import type { ViewMode } from "@/features/profile/model/types";

export const useProfileViewMode = (
  profileUserId: string,
  currentUserId: string | null,
): { viewMode: ViewMode; isFollowing: boolean } => {
  const { data: isFollowing } = useSuspenseQuery(
    followQueries.isFollowing(currentUserId, profileUserId),
  );

  const isOwnProfile = currentUserId === profileUserId;

  return { viewMode: isOwnProfile ? "owner" : "visitor", isFollowing };
};

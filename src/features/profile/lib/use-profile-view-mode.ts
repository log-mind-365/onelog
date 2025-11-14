import { useQuery } from "@tanstack/react-query";
import { followQueries } from "@/entities/follow/api/queries";
import type { ProfileViewMode } from "@/entities/user/model/types";

export const useProfileViewMode = (
  profileUserId: string,
  currentUserId: string | null,
): {
  viewMode: ProfileViewMode;
  isFollowing: boolean;
  currentUserId: string | null;
} => {
  const { data: isFollowing } = useQuery(
    followQueries.isFollowing(currentUserId, profileUserId),
  );

  const isOwnProfile = currentUserId === profileUserId;

  return {
    viewMode: isOwnProfile ? "owner" : "visitor",
    isFollowing: isFollowing ?? false,
    currentUserId,
  };
};

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { userQueries } from "@/entities/user/api/queries";
import type { ProfileTab } from "@/entities/user/model/types";
import { useProfileViewMode } from "@/features/profile/lib/use-profile-view-mode";

export const useProfilePage = (
  profileUserId: string,
  currentUserId: string | null,
) => {
  const [selectedTab, setSelectedTab] = useState<ProfileTab>("summary");
  const { viewMode, isFollowing } = useProfileViewMode(
    profileUserId,
    currentUserId,
  );
  const { data: user } = useSuspenseQuery(
    userQueries.getUserInfo(profileUserId),
  );

  const handleTabChange = (value: string) => {
    if (selectedTab === value) return;
    setSelectedTab(value as ProfileTab);
  };

  return {
    selectedTab,
    user,
    viewMode,
    isFollowing,
    onTabChange: handleTabChange,
  };
};

import { useAuth } from "@/features/auth/model/store";

export type ProfileViewMode = "owner" | "guest";

export const useProfileViewMode = (profileUserId: string) => {
  const me = useAuth((state) => state.me);

  const isOwnProfile = me?.id === profileUserId;
  return isOwnProfile ? "owner" : "guest";
};

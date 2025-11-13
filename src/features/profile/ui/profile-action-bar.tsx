import type { ProfileViewMode } from "@/entities/user/model/types";
import { OwnerActions } from "@/features/profile/ui/owner-actions";
import { ProfileDetailVisitorActions } from "@/features/profile/ui/profile-detail-visitor-actions";

type ProfileActionBarProps = {
  viewMode: ProfileViewMode;
  profileUserId: string;
  currentUserId: string | null;
  isFollowing?: boolean;
};

export const ProfileActionBar = ({
  viewMode,
  profileUserId,
  currentUserId,
  isFollowing,
}: ProfileActionBarProps) => {
  switch (viewMode) {
    case "visitor":
      return (
        <ProfileDetailVisitorActions
          profileUserId={profileUserId}
          currentUserId={currentUserId}
          isFollowing={isFollowing}
        />
      );
    case "owner":
      return <OwnerActions />;
  }
};

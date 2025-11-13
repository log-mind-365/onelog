import type { ViewMode } from "@/features/profile/model/types";
import { OwnerActions } from "@/features/profile/ui/owner-actions";
import { VisitorActions } from "@/features/profile/ui/visitor-actions";

type VisitorActionsProps = {
  viewMode: ViewMode;
  profileUserId: string;
  currentUserId: string | null;
};

export const ProfileActionBar = ({
  viewMode,
  profileUserId,
  currentUserId,
}: VisitorActionsProps) => {
  switch (viewMode) {
    case "visitor":
      return (
        <VisitorActions
          profileUserId={profileUserId}
          currentUserId={currentUserId}
        />
      );
    case "owner":
      return <OwnerActions />;
  }
};

import type { ArticleViewMode } from "@/entities/article/model/types";
import { ProfileSummaryOwnerActions } from "@/features/article/ui/profile-summary-owner-actions";
import { ProfileSummaryVisitorActions } from "@/features/article/ui/profile-summary-visitor-actions";

type ArticleDetailAuthorProfileActionBarProps = {
  viewMode: ArticleViewMode;
  profileUserId: string;
  currentUserId: string | null;
  isFollowing: boolean;
};

export const ProfileSummaryActionBar = ({
  viewMode,
  profileUserId,
  currentUserId,
  isFollowing,
}: ArticleDetailAuthorProfileActionBarProps) => {
  switch (viewMode) {
    case "viewer":
      return (
        <ProfileSummaryVisitorActions
          profileUserId={profileUserId}
          currentUserId={currentUserId}
          isFollowing={isFollowing}
        />
      );
    case "author":
      return <ProfileSummaryOwnerActions currentUserId={currentUserId ?? ""} />;
  }
};

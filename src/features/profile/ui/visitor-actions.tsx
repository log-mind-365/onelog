import { useState } from "react";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useFollowToggle } from "@/features/follow/lib/use-follow-toggle";
import { useProfileViewMode } from "@/features/profile/lib/use-profile-view-mode";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

type VisitorActionsProps = {
  profileUserId: string;
  currentUserId: string | null;
};

export const VisitorActions = ({
  profileUserId,
  currentUserId,
}: VisitorActionsProps) => {
  const { mutate: toggleFollow, isPending } = useFollowToggle();
  const { authGuard } = useAuthGuard();
  const { isFollowing } = useProfileViewMode(profileUserId, currentUserId);

  const handleFollowToggle = () => {
    authGuard(() =>
      toggleFollow({
        followingId: profileUserId,
        followerId: currentUserId ?? "",
      }),
    );
  };

  return isFollowing ? (
    <Button onClick={handleFollowToggle} disabled={isPending}>
      {isPending ? <Spinner /> : null}
      언팔로우
    </Button>
  ) : (
    <Button onClick={handleFollowToggle} disabled={isPending}>
      {isPending ? <Spinner /> : null}
      팔로우
    </Button>
  );
};

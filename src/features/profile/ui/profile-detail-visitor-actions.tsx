import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useFollowToggle } from "@/features/follow/lib/use-follow-toggle";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

type ProfileDetailVisitorActionsProps = {
  profileUserId: string;
  currentUserId: string | null;
  isFollowing?: boolean;
};

export const ProfileDetailVisitorActions = ({
  profileUserId,
  currentUserId,
  isFollowing,
}: ProfileDetailVisitorActionsProps) => {
  const { mutate: toggleFollow, isPending } = useFollowToggle();
  const authGuard = useAuthGuard();

  const handleFollowToggle = () => {
    authGuard(() =>
      toggleFollow({
        followingId: profileUserId,
        followerId: currentUserId ?? "",
      }),
    );
  };

  return (
    <Button onClick={handleFollowToggle} disabled={isPending}>
      {isPending ? <Spinner /> : isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

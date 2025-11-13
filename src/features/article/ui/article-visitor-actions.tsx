import Link from "next/link";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useFollowToggle } from "@/features/follow/lib/use-follow-toggle";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { ROUTES } from "@/shared/model/routes";

type ProfilerSummaryVisitorActionsProps = {
  profileUserId: string;
  currentUserId: string | null;
  isFollowing: boolean;
};

export const ProfileVisitorActions = ({
  profileUserId,
  currentUserId,
  isFollowing,
}: ProfilerSummaryVisitorActionsProps) => {
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
    <>
      <Button onClick={handleFollowToggle} disabled={isPending}>
        {isPending ? <Spinner /> : isFollowing ? "언팔로우" : "팔로우"}
      </Button>
      <Button asChild>
        <Link href={ROUTES.PROFILE.VIEW(profileUserId)}>프로필 페이지</Link>
      </Button>
    </>
  );
};

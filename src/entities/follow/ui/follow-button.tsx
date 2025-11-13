import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

type FollowButtonProps = {
  onFollow: () => void;
  isFollowing: boolean;
  isPending: boolean;
};

export const FollowButton = ({
  onFollow,
  isFollowing,
  isPending,
}: FollowButtonProps) => {
  return isFollowing ? (
    <Button onClick={onFollow} disabled={isPending}>
      {isPending ? <Spinner /> : null}
      언팔로우
    </Button>
  ) : (
    <Button onClick={onFollow} disabled={isPending}>
      {isPending ? <Spinner /> : null}
      팔로우
    </Button>
  );
};

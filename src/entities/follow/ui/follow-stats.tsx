import { Skeleton } from "@/shared/components/ui/skeleton";

type FollowStatsProps = {
  followerCount: number;
  followingCount: number;
};

export const FollowStats = ({
  followerCount,
  followingCount,
}: FollowStatsProps) => {
  return (
    <div className="flex gap-4">
      <span className="text-muted-foreground text-sm">{`팔로워 ${followerCount}명`}</span>
      <span className="text-muted-foreground text-sm">{`팔로잉 ${followingCount}명`}</span>
    </div>
  );
};

export const FollowStatsSkeleton = () => {
  return (
    <div className="flex gap-4">
      <Skeleton className="h-4 w-10" />
      <Skeleton className="h-4 w-10" />
    </div>
  );
};

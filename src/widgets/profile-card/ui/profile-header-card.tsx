import { Mail } from "lucide-react";
import { FollowStats } from "@/entities/follow/ui/follow-stats";
import type { ProfileViewMode } from "@/entities/user/model/types";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { ProfileActionBar } from "@/features/profile/ui/profile-action-bar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/shared/components/ui/card";

type ProfileHeaderCardProps = {
  avatarUrl: string | null;
  userName: string;
  email: string;
  viewMode: ProfileViewMode;
  profileUserId: string;
  currentUserId: string | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
};

export const ProfileHeaderCard = ({
  avatarUrl,
  userName,
  email,
  followerCount,
  followingCount,
  viewMode,
  profileUserId,
  currentUserId,
  isFollowing,
}: ProfileHeaderCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        <UserAvatar avatarUrl={avatarUrl} fallback={userName} size="xl" />
        <div className="flex flex-col items-center gap-1">
          <CardTitle className="text-2xl">{userName}</CardTitle>
          <CardDescription className="flex flex-col items-center text-muted-foreground text-sm">
            <FollowStats
              followerCount={followerCount ?? 0}
              followingCount={followingCount ?? 0}
            />
            <div className="flex gap-2">
              <Mail className="size-4" />
              {email}
            </div>
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <CardAction className="flex items-center gap-2">
          <ProfileActionBar
            viewMode={viewMode}
            profileUserId={profileUserId}
            currentUserId={currentUserId}
            isFollowing={isFollowing}
          />
        </CardAction>
      </CardFooter>
    </Card>
  );
};

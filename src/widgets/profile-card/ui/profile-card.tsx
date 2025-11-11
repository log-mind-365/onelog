import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import {
  UserInfoBase,
  UserInfoBaseActions,
} from "@/entities/user/ui/user-info-base";
import { useFollow } from "@/features/follow/lib/use-follow";
import { ProfileNavigationButtons } from "@/features/profile/ui/profile-navigation-buttons";
import { ROUTES } from "@/shared/model/routes";

type ProfileCardProps = {
  userName: string;
  avatarUrl: string | null;
  email: string;
  aboutMe: string;
  isMe: boolean;
  currentUserId: string | null;
  userId: string;
};

export const ProfileCard = ({
  userName,
  avatarUrl,
  email,
  aboutMe,
  isMe,
  currentUserId,
  userId,
}: ProfileCardProps) => {
  const router = useRouter();
  const { data: isFollowing } = useSuspenseQuery(
    followQueries.isFollowing(currentUserId, userId),
  );
  const { mutate: toggleFollow, isPending: isPendingFollow } = useFollow();

  const handleFollow = () => {
    if (!currentUserId || currentUserId === userId) return null;
    toggleFollow({ followerId: currentUserId, followingId: userId });
  };

  return (
    <UserInfoBase
      userName={userName}
      email={email}
      aboutMe={aboutMe}
      avatarUrl={avatarUrl}
      className="flex-col"
    >
      <UserInfoBaseActions className="flex-row">
        <FollowButton
          onFollow={handleFollow}
          isFollowing={isFollowing}
          isPending={isPendingFollow}
          isMe={isMe}
        />
        <ProfileNavigationButtons
          isMe={isMe}
          onViewProfile={() => router.push(ROUTES.SETTINGS.PROFILE)}
          onEditProfile={() => router.push(ROUTES.PROFILE.VIEW(userId))}
        />
      </UserInfoBaseActions>
    </UserInfoBase>
  );
};

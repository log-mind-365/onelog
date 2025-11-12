"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import { FollowStats } from "@/entities/follow/ui/follow-stats";
import { userQueries } from "@/entities/user/api/queries";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useFollowToggle } from "@/features/follow/lib/use-follow-toggle";
import { ProfileNavigationButtons } from "@/features/profile/ui/profile-navigation-buttons";
import { PageContainer } from "@/shared/components/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ROUTES } from "@/shared/model/routes";

type ProfilePageViewProps = {
  profileUserId: string;
  currentUserId: string | null;
};

export const ProfilePageView = ({
  profileUserId,
  currentUserId,
}: ProfilePageViewProps) => {
  const router = useRouter();
  const { data: user } = useSuspenseQuery(
    userQueries.getUserInfo(profileUserId),
  );
  const { data: stats } = useSuspenseQuery(followQueries.stats(profileUserId));
  const { data: isFollowing } = useSuspenseQuery(
    followQueries.isFollowing(currentUserId, profileUserId),
  );
  const { mutate: toggleFollow, isPending: isFollowPending } =
    useFollowToggle();

  if (!user) {
    return null;
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFollow = () => {
    if (!currentUserId || currentUserId === user.id) return null;
    toggleFollow({ followerId: currentUserId, followingId: user.id });
  };

  return (
    <PageContainer title="프로필" description="사용자 정보를 확인하세요">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4">
          <UserAvatar
            avatarUrl={user.avatarUrl || undefined}
            fallback={user.userName}
            size="xl"
          />
          <div className="flex flex-col items-center gap-1">
            <CardTitle className="text-2xl">{user.userName}</CardTitle>
            <FollowStats
              followerCount={stats?.followerCount ?? 0}
              followingCount={stats?.followingCount ?? 0}
            />
            <CardDescription className="flex items-center gap-2">
              <Mail className="size-4" />
              {user.email}
            </CardDescription>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <FollowButton
            isFollowing={isFollowing}
            isMe={profileUserId === currentUserId}
            onFollow={handleFollow}
            isPending={isFollowPending}
          />
          <ProfileNavigationButtons
            isMe={profileUserId === currentUserId}
            onViewProfile={() => null}
            onEditProfile={() => router.push(ROUTES.SETTINGS.PROFILE)}
          />
        </CardFooter>
      </Card>

      {/* About Me Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            소개
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.aboutMe ? (
            <p className="text-sm leading-relaxed">{user.aboutMe}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              아직 소개가 작성되지 않았습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            계정 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">가입일</span>
            <span className="font-medium">{formatDate(user.createdAt)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">마지막 업데이트</span>
            <span className="font-medium">{formatDate(user.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

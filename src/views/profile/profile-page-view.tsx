"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Mail, User } from "lucide-react";
import { Suspense } from "react";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowStats } from "@/entities/follow/ui/follow-stats";
import { userQueries } from "@/entities/user/api/queries";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useProfileViewMode } from "@/features/profile/lib/use-profile-view-mode";
import { ProfileActionBar } from "@/features/profile/ui/profile-action-bar";
import { PageContainer } from "@/shared/components/page-container";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ProfileHeaderCard } from "@/widgets/profile-card/ui/profile-header-card";

type ProfilePageViewProps = {
  profileUserId: string;
  currentUserId: string | null;
};

export const ProfilePageView = ({
  profileUserId,
  currentUserId,
}: ProfilePageViewProps) => {
  const { viewMode, isFollowing } = useProfileViewMode(
    profileUserId,
    currentUserId,
  );
  const { data: user } = useSuspenseQuery(
    userQueries.getUserInfo(profileUserId),
  );
  const { data: stats } = useQuery(followQueries.stats(profileUserId));

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PageContainer title="프로필" description="사용자 정보를 확인하세요">
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileHeaderCard
          avatarUrl={user?.avatarUrl ?? null}
          userName={user?.userName ?? ""}
          email={user?.email ?? ""}
          viewMode={viewMode}
          profileUserId={profileUserId}
          currentUserId={currentUserId}
          followerCount={stats?.followerCount ?? 0}
          followingCount={stats?.followingCount ?? 0}
          isFollowing={isFollowing}
        />
      </Suspense>

      {/* About Me Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            소개
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user?.aboutMe ? (
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
            <span className="font-medium">
              {formatDate(user?.createdAt ?? "")}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">마지막 업데이트</span>
            <span className="font-medium">
              {formatDate(user?.updatedAt ?? "")}
            </span>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { userQueries } from "@/entities/user/api/queries";
import { useProfileViewMode } from "@/features/profile/lib/use-profile-view-mode";
import { PageContainer } from "@/shared/components/page-container";
import { ProfileAboutMeCard } from "@/widgets/profile-card/ui/profile-about-me-card";
import { ProfileAccountInfoCard } from "@/widgets/profile-card/ui/profile-account-info-card";
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
          isFollowing={isFollowing}
        />
      </Suspense>

      <ProfileAboutMeCard aboutMe={user?.aboutMe ?? null} />

      <ProfileAccountInfoCard
        createdAt={user?.createdAt ?? null}
        updatedAt={user?.updatedAt ?? null}
      />
    </PageContainer>
  );
};

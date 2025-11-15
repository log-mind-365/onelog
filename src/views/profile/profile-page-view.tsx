"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ProfileTab } from "@/entities/user/model/types";
import { userQueries } from "@/entities/user/api/queries";
import { useProfileViewMode } from "@/features/profile/lib/use-profile-view-mode";
import { PageContainer } from "@/shared/components/page-container";
import { ProfileAboutMeCard } from "@/widgets/profile-card/ui/profile-about-me-card";
import { ProfileAccountInfoCard } from "@/widgets/profile-card/ui/profile-account-info-card";
import { ProfileHeaderCard } from "@/widgets/profile-card/ui/profile-header-card";
import { ProfileTabNavigation } from "@/widgets/profile-card/ui/profile-tab-navigation";

type ProfilePageViewProps = {
  profileUserId: string;
  currentUserId: string | null;
};

export const ProfilePageView = ({
  profileUserId,
  currentUserId,
}: ProfilePageViewProps) => {
  const [selectedTab, setSelectedTab] = useState<ProfileTab>("summary");
  const { viewMode, isFollowing } = useProfileViewMode(
    profileUserId,
    currentUserId,
  );
  const { data: user } = useSuspenseQuery(
    userQueries.getUserInfo(profileUserId),
  );

  return (
    <PageContainer title="프로필" description="사용자 정보를 확인하세요">
      <ProfileHeaderCard
        avatarUrl={user?.avatarUrl ?? null}
        userName={user?.userName ?? ""}
        email={user?.email ?? ""}
        viewMode={viewMode}
        profileUserId={profileUserId}
        currentUserId={currentUserId}
        isFollowing={isFollowing}
      />

      <ProfileTabNavigation
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      {selectedTab === "summary" && (
        <>
          <ProfileAboutMeCard aboutMe={user?.aboutMe ?? null} />
          <ProfileAccountInfoCard
            createdAt={user?.createdAt ?? null}
            updatedAt={user?.updatedAt ?? null}
          />
        </>
      )}

      {selectedTab === "emotions" && (
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground">감정 통계 기능 준비 중입니다.</p>
        </div>
      )}

      {selectedTab === "diaries" && (
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground">작성한 일기 목록 준비 중입니다.</p>
        </div>
      )}

      {selectedTab === "articles" && (
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground">
            작성한 아티클 목록 준비 중입니다.
          </p>
        </div>
      )}

      {selectedTab === "liked" && (
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground">
            좋아요한 게시글 목록 준비 중입니다.
          </p>
        </div>
      )}
    </PageContainer>
  );
};

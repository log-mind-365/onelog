"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { userQueries } from "@/entities/user/api/queries";
import type { ProfileTab } from "@/entities/user/model/types";
import { useProfileViewMode } from "@/features/profile/lib/use-profile-view-mode";
import { PageContainer } from "@/shared/components/page-container";
import { Spacer } from "@/shared/components/spacer";
import { UserArticleList } from "@/widgets/article-list/ui/user-article-list";
import { UserLikedArticleList } from "@/widgets/article-list/ui/user-liked-article-list";
import { EmotionActivityGraph } from "@/widgets/profile-card/ui/emotion-activity-graph";
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

  const handleTabChange = (value: string) => {
    if (selectedTab === value) return;
    setSelectedTab(value as ProfileTab);
  };

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
        onTabChange={handleTabChange}
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
        <EmotionActivityGraph userId={profileUserId} />
      )}

      {selectedTab === "diaries" && (
        <>
          <Spacer />
          <UserArticleList
            userId={profileUserId}
            currentUserId={currentUserId}
            accessType="private"
            emptyTitle="아직 작성된 일기가 없어요."
            emptyDescription="일기를 작성해 보세요."
          />
        </>
      )}

      {selectedTab === "articles" && (
        <>
          <Spacer />
          <UserArticleList
            userId={profileUserId}
            currentUserId={currentUserId}
            accessType="public"
            emptyTitle="아직 작성된 글이 없어요."
            emptyDescription="글을 작성해 보세요."
          />
        </>
      )}

      {selectedTab === "liked" && (
        <>
          <Spacer />
          <UserLikedArticleList
            userId={profileUserId}
            currentUserId={currentUserId}
          />
        </>
      )}
    </PageContainer>
  );
};

"use client";

import { PageContainer } from "@/shared/components/page-container";
import { Spacer } from "@/shared/components/spacer";
import { useProfilePage } from "@/views/profile/model/use-profile-page";
import { ActivityGraph } from "@/widgets/card/profile-card/ui/activity-graph";
import { ProfileAboutMeCard } from "@/widgets/card/profile-card/ui/profile-about-me-card";
import { ProfileAccountInfoCard } from "@/widgets/card/profile-card/ui/profile-account-info-card";
import { ProfileHeaderCard } from "@/widgets/card/profile-card/ui/profile-header-card";
import { ProfileTabNavigation } from "@/widgets/card/profile-card/ui/profile-tab-navigation";
import { UserArticleList } from "@/widgets/list/article-list/ui/user-article-list";
import { UserLikedArticleList } from "@/widgets/list/article-list/ui/user-liked-article-list";

type ProfilePageViewProps = {
  profileUserId: string;
  currentUserId: string | null;
};

export const ProfilePageView = ({
  profileUserId,
  currentUserId,
}: ProfilePageViewProps) => {
  const { viewMode, isFollowing, user, onTabChange, selectedTab } =
    useProfilePage(profileUserId, currentUserId);

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
        onTabChange={onTabChange}
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

      {selectedTab === "diaries" && (
        <>
          <ActivityGraph userId={profileUserId} />
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
          <ActivityGraph userId={profileUserId} />
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

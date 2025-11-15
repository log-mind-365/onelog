"use client";

import type { ProfileTab } from "@/entities/user/model/types";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

type ProfileTabNavigationProps = {
  selectedTab?: ProfileTab;
  onTabChange?: (tab: ProfileTab) => void;
};

export const ProfileTabNavigation = ({
  selectedTab = "summary",
  onTabChange,
}: ProfileTabNavigationProps) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => onTabChange?.(value as ProfileTab)}
      className="w-full rounded-lg border bg-card shadow-sm"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="summary">요약</TabsTrigger>
        <TabsTrigger value="emotions">감정 한 눈에 보기</TabsTrigger>
        <TabsTrigger value="diaries">작성한 일기</TabsTrigger>
        <TabsTrigger value="articles">작성한 아티클</TabsTrigger>
        <TabsTrigger value="liked">좋아요한 게시글</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

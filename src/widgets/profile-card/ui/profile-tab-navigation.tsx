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
      className="w-full rounded-lg border bg-card p-1 shadow-sm"
    >
      <TabsList className="grid w-full grid-cols-5 bg-card">
        <TabsTrigger value="summary" className="text-xs">
          요약
        </TabsTrigger>
        <TabsTrigger value="emotions" className="text-xs">
          감정 한 눈에 보기
        </TabsTrigger>
        <TabsTrigger value="diaries" className="text-xs">
          작성한 일기
        </TabsTrigger>
        <TabsTrigger value="articles" className="text-xs">
          작성한 아티클
        </TabsTrigger>
        <TabsTrigger value="liked" className="text-xs">
          좋아요한 게시글
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

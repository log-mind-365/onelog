"use client";

import { Suspense } from "react";
import { PageContainer } from "@/shared/components/page-container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { InfiniteArticleList } from "@/widgets/article-list/ui/infinite-article-list";
import { FakeForm } from "@/widgets/fake-form/ui/fake-form";

export const HomePageView = () => {
  return (
    <PageContainer
      title="안녕하세요"
      description="오늘 사람들이 기록한 문장을 확인하세요."
      banner={
        <TransitionContainer.SlideIn type="spring" className="w-full">
          <FakeForm />
        </TransitionContainer.SlideIn>
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <InfiniteArticleList />
      </Suspense>
    </PageContainer>
  );
};

import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";
import { ArticleDetailPageSidebar } from "@/views/article/article-detail-page-sidebar";

export const ArticleDetailPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn>
      <ArticleDetailPageSidebar />
      {children}
    </TransitionContainer.FadeIn>
  );
};

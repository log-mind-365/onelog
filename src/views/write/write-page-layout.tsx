import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";
import { WritePageHeader } from "@/views/write/write-page-header.widget";
import { WritePageSidebar } from "@/views/write/write-page-sidebar";

export const WritePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex flex-col items-start justify-center gap-4 sm:flex-row">
      <WritePageSidebar />
      <WritePageHeader />
      {children}
    </TransitionContainer.FadeIn>
  );
};

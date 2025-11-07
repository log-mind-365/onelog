import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";
import { HomePageHeader } from "@/views/home/home-page-header.widget";
import { HomePageSidebar } from "@/views/home/home-page-sidebar";

const Template = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex w-full flex-col items-start justify-center gap-4 sm:flex-row">
      <HomePageHeader />
      <HomePageSidebar />
      {children}
    </TransitionContainer.FadeIn>
  );
};

export default Template;

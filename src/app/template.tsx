import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";
import { HomePageHeader } from "@/views/home/home-page-header.widget";

const Template = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex flex-col gap-4">
      <HomePageHeader />
      {children}
    </TransitionContainer.FadeIn>
  );
};

export default Template;

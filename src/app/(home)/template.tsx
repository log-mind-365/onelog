import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";
import { HomePageSidebar } from "@/widgets/home-page-sidebar/ui/home-page-sidebar";

const Template = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex h-screen flex-row items-start justify-center">
      <HomePageSidebar />
      <main className="w-full sm:w-lg md:w-xl lg:w-2xl">{children}</main>
    </TransitionContainer.FadeIn>
  );
};

export default Template;

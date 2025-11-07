import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";

export const HomePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex flex-row items-start justify-center gap-4">
      {children}
    </TransitionContainer.FadeIn>
  );
};

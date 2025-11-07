import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";

export const ArticleDetailPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex flex-col items-start justify-center gap-4 sm:flex-row">
      {children}
    </TransitionContainer.FadeIn>
  );
};

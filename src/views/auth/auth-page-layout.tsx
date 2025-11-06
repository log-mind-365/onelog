import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";

export const AuthPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
      {children}
    </TransitionContainer.FadeIn>
  );
};

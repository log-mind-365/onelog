import type { PropsWithChildren } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
      {children}
    </TransitionContainer.FadeIn>
  );
};

export default AuthLayout;

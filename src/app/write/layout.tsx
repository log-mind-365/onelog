import type { PropsWithChildren } from "react";
import { Container } from "@/shared/components/container";
import { TransitionContainer } from "@/shared/components/transition-container";

const Layout = ({ children }: PropsWithChildren) => {
  return (

    <TransitionContainer.FadeIn>
      <Container.Layout>{children}</Container.Layout>
    </TransitionContainer.FadeIn>
  );
};

export default Layout;

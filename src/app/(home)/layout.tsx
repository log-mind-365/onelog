import type { PropsWithChildren } from "react";
import { Container } from "@/shared/components/container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { HomePageHeader } from "@/widgets/header/home-page-header.widget";
import { HomePageSidebar } from "@/widgets/sidebar/home-page-sidebar.widget";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn>
      <Container.Layout>
        <HomePageHeader />
        <HomePageSidebar />
        {children}
      </Container.Layout>
    </TransitionContainer.FadeIn>
  );
};

export default Layout;

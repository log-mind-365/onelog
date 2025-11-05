import type { PropsWithChildren } from "react";
import { Container } from "@/shared/components/container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { ArticleDetailPageSidebar } from "@/widgets/sidebar/ui/article-detail-page-sidebar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <TransitionContainer.FadeIn>
      <Container.Layout>
        <ArticleDetailPageSidebar />
        {children}
      </Container.Layout>
    </TransitionContainer.FadeIn>
  );
};

export default Layout;

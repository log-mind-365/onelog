import type { PropsWithChildren } from "react";
import { AuthGuardModal } from "@/features/auth-guard/auth-guard-modal.ui";
import { SignInModal } from "@/features/sign-in/sign-in-modal.ui";
import { SignUpModal } from "@/features/sign-up/sign-up-modal.ui";
import { Container } from "@/shared/components/container";
import { Modal } from "@/shared/components/modal-container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { HomePageHeader } from "@/widgets/header/home-page-header.widget";
import { HomePageSidebar } from "@/widgets/sidebar/home-page-sidebar.widget";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <TransitionContainer.FadeIn>
        <Container.Layout>
          <HomePageHeader />
          <HomePageSidebar />
          {children}
        </Container.Layout>
      </TransitionContainer.FadeIn>

      {/* Auth Dialogs */}
      <Modal type="auth-guard">
        <AuthGuardModal />
      </Modal>
      <Modal type="sign-in">
        <SignInModal />
      </Modal>
      <Modal type="sign-up">
        <SignUpModal />
      </Modal>
    </>
  );
};

export default Layout;

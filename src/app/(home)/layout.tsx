import type { PropsWithChildren } from "react";
import { AuthGuardModal } from "@/features/auth/ui/auth-guard-modal";
import { SignInModal } from "@/features/sign-in/ui/sign-in-modal";
import { SignOutModal } from "@/features/sign-out/ui/sign-out-modal";
import { SignUpModal } from "@/features/sign-up/ui/sign-up-modal";
import { Container } from "@/shared/components/container";
import { Modal } from "@/shared/components/modal-container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { HomePageHeader } from "@/widgets/header/home-page-header.widget";
import { HomePageSidebar } from "@/widgets/sidebar/ui/home-page-sidebar";

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

      <Modal type="auth-guard">
        <AuthGuardModal />
      </Modal>
      <Modal type="sign-in">
        <SignInModal />
      </Modal>
      <Modal type="sign-up">
        <SignUpModal />
      </Modal>
      <Modal type="sign-out">
        <SignOutModal />
      </Modal>
    </>
  );
};

export default Layout;

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { AuthGuardModal } from "@/features/auth/ui/auth-guard-modal";
import { SignInModal } from "@/features/auth/ui/sign-in-modal";
import { SignOutModal } from "@/features/auth/ui/sign-out-modal";
import { SignUpModal } from "@/features/auth/ui/sign-up-modal";
import { Container } from "@/shared/components/container";
import { Modal } from "@/shared/components/modal-container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { InfiniteArticleList } from "@/widgets/card/infinite-article-list";
import { FakeForm } from "@/widgets/form/fake-form.ui";

const HomePage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(articleQueries.infinite());

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>loading...</p>}>
          <Container.Body>
            <TransitionContainer.SlideIn type="spring">
              <FakeForm />
            </TransitionContainer.SlideIn>

            <InfiniteArticleList />
          </Container.Body>
        </Suspense>
      </HydrationBoundary>

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

export default HomePage;

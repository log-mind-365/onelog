import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { Container } from "@/shared/components/container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { InfiniteArticleList } from "@/widgets/card/infinite-article-list.ui";
import { FakeForm } from "@/widgets/form/fake-form.ui";

const HomePage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(articleQueries.infinite());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>loading...</p>}>
        <Container.Body>
          <TransitionContainer.FadeIn>
            <TransitionContainer.SlideIn type="spring">
              <FakeForm />
            </TransitionContainer.SlideIn>

            <InfiniteArticleList />
          </TransitionContainer.FadeIn>
        </Container.Body>
      </Suspense>
    </HydrationBoundary>
  );
};

export default HomePage;

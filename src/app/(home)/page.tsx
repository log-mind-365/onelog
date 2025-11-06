import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { PageContainer } from "@/shared/components/page-container";
import { Spinner } from "@/shared/components/ui/spinner";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { HomePageView } from "@/views/home/home-page-view";

const HomePage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(articleQueries.infinite());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <PageContainer>
            <Spinner />
          </PageContainer>
        }
      >
        <HomePageView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default HomePage;

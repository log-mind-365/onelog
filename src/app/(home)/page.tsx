import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { CenterContainer } from "@/shared/components/center-container";
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
          <CenterContainer>
            <Spinner />
          </CenterContainer>
        }
      >
        <HomePageView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default HomePage;

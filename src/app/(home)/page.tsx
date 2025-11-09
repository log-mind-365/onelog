import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { userQueries } from "@/entities/user/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";
import { PageContainer } from "@/shared/components/page-container";
import { Spinner } from "@/shared/components/ui/spinner";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { HomePageView } from "@/views/home/home-page-view";

const HomePage = async () => {
  const queryClient = getQueryClient();
  const user = await getCurrentUser();

  void Promise.all([
    queryClient.prefetchQuery(userQueries.getUserInfo(user?.id ?? null)),
    queryClient.prefetchInfiniteQuery(
      articleQueries.infinite(user?.id ?? null),
    ),
  ]);

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

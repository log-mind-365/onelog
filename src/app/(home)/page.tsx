import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { userQueries } from "@/entities/user/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { HomePageView } from "@/views/home/home-page-view";

const HomePage = async () => {
  const queryClient = getQueryClient();
  const user = await getCurrentUser();

  await Promise.all([
    queryClient.prefetchQuery(userQueries.getUserInfo(user?.id ?? null)),
    queryClient.prefetchInfiniteQuery(articleQueries.list(user?.id ?? null)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageView />
    </HydrationBoundary>
  );
};

export default HomePage;

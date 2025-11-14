import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { userQueries } from "@/entities/user/api/queries";
import { getUserIdFromMiddleware } from "@/shared/lib/helpers/server-helper";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { HomePageView } from "@/views/home/home-page-view";

const HomePage = async () => {
  const queryClient = getQueryClient();
  const userId = await getUserIdFromMiddleware();

  await Promise.all([
    queryClient.prefetchQuery(userQueries.getUserInfo(userId)),
    queryClient.prefetchInfiniteQuery(articleQueries.publicList(userId)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageView currentUserId={userId} />
    </HydrationBoundary>
  );
};

export default HomePage;

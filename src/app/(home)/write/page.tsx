import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { WritePageView } from "@/views/write/write-page-view";

const Page = async () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WritePageView />
    </HydrationBoundary>
  );
};

export default Page;

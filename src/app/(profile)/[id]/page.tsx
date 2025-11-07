import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { userQueries } from "@/entities/user/api/queries";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ProfilePageView } from "@/views/profile/profile-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(userQueries.getUserInfo(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>loading...</p>}>
        <ProfilePageView id={id} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;

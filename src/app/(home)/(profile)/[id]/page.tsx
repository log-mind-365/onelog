import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { followQueries } from "@/entities/follow/api/queries";
import { userQueries } from "@/entities/user/api/queries";
import { getUserInfo } from "@/entities/user/api/server";
import { getCurrentUser } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ProfilePageView } from "@/views/profile/profile-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  const currentUser = await getCurrentUser();
  const profileUser = await getUserInfo(id);

  if (!profileUser) {
    notFound();
  }

  await Promise.all([
    queryClient.prefetchQuery(userQueries.getUserInfo(id)),
    queryClient.prefetchQuery(followQueries.stats(id)),
    queryClient.prefetchQuery(
      followQueries.isFollowing(currentUser?.id ?? null, id),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageView
        profileUserId={id}
        currentUserId={currentUser?.id ?? null}
      />
    </HydrationBoundary>
  );
};

export default Page;

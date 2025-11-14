import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { userQueries } from "@/entities/user/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ProfilePageView } from "@/views/profile/profile-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  const [currentUser, profileUser] = await Promise.all([
    getCurrentUser(),
    queryClient.fetchQuery(userQueries.getUserInfo(id)),
  ]);

  if (!profileUser) {
    notFound();
  }

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

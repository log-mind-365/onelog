import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { userQueries } from "@/entities/user/api/queries";
import { profileUserUUIDSchema } from "@/features/profile/model/schemas";
import { getUserIdFromMiddleware } from "@/shared/lib/helpers/server-helper";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ProfilePageView } from "@/views/profile/profile-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  const parsedId = profileUserUUIDSchema.safeParse({ id });

  if (!parsedId.success) {
    notFound();
  }

  const [currentUserId, profileUser] = await Promise.all([
    getUserIdFromMiddleware(),
    queryClient.fetchQuery(userQueries.getUserInfo(parsedId.data.id)),
  ]);

  if (!profileUser) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageView profileUserId={id} currentUserId={currentUserId} />
    </HydrationBoundary>
  );
};

export default Page;

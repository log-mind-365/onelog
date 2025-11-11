import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

  // UUID 형식 검증 (정규식)
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  // 사용자 존재 여부 확인
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
      <Suspense fallback={<p>loading...</p>}>
        <ProfilePageView
          profileUserId={id}
          currentUserId={currentUser?.id ?? null}
        />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;

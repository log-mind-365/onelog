import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { userQueries } from "@/entities/user/api/queries";
import { getUserInfo } from "@/entities/user/api/server";
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

  // 사용자 존재 여부 확인
  const user = await getUserInfo(id);
  if (!user) {
    notFound();
  }

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

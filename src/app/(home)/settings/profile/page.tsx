import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { userQueries } from "@/entities/user/api/queries";
import { getUserIdFromProxy } from "@/shared/lib/helpers/server-helper";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";
import { SettingsProfilePageView } from "@/views/settings/profile/settings-profile-page-view";

const Page = async () => {
  const queryClient = getQueryClient();
  const userId = await getUserIdFromProxy();

  if (!userId) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  await queryClient.prefetchQuery(userQueries.getUserInfo(userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsProfilePageView currentUserId={userId} />
    </HydrationBoundary>
  );
};

export default Page;

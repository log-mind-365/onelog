import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { userQueries } from "@/entities/user/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";
import { SettingsProfilePageView } from "@/views/settings/profile/settings-profile-page-view";

const Page = async () => {
  const queryClient = getQueryClient();
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  await queryClient.prefetchQuery(userQueries.getUserInfo(user.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsProfilePageView currentUserId={user?.id} />
    </HydrationBoundary>
  );
};

export default Page;

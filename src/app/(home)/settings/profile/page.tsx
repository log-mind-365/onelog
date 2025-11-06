import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { userQueries } from "@/entities/user/api/queries";
import { createClient } from "@/shared/lib/supabase/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";
import { SettingsProfilePageView } from "@/views/settings/profile/settings-profile-page-view";

const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const queryClient = getQueryClient();

  if (error || !user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  await queryClient.prefetchQuery(userQueries.getUserInfo(user.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>loading...</p>}>
        <SettingsProfilePageView id={user?.id} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;

import { Suspense } from "react";
import { TransitionContainer } from "@/shared/components/transition-container";
import { ProfilePageClient } from "./profile-page-client";

const Page = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <TransitionContainer.FadeIn>
        <ProfilePageClient />
      </TransitionContainer.FadeIn>
    </Suspense>
  );
};

export default Page;

import { PageContainer } from "@/shared/components/page-container";
import { Spinner } from "@/shared/components/ui/spinner";

export const SpinnerPageView = () => {
  return (
    <PageContainer className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Spinner />
    </PageContainer>
  );
};

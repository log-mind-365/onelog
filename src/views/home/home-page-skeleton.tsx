import { PageContainer } from "@/shared/components/page-container";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const HomePageSkeleton = () => {
  return (
    <PageContainer>
      <CardHeaderSkeleton />
    </PageContainer>
  );
};

const CardHeaderSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

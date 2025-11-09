import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getCurrentUser } from "@/features/auth/api/server";
import { Spinner } from "@/shared/components/ui/spinner";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ArticleEditPageView } from "@/views/article/article-edit-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ArticleEditPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  const user = await getCurrentUser();
  const userId = user?.id ?? null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Spinner />}>
        <ArticleEditPageView id={id} userId={userId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ArticleEditPage;

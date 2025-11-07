import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";
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

  await queryClient.prefetchQuery(articleQueries.detail(id, userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleEditPageView id={id} userId={userId} />
    </HydrationBoundary>
  );
};

export default ArticleEditPage;

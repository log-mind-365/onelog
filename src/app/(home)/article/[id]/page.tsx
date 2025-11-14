import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { commentQueries } from "@/entities/comment/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ArticleDetailPageView } from "@/views/article/article-detail-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ArticlePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const articleId = Number(id);
  const queryClient = getQueryClient();
  const user = await getCurrentUser();
  const currentUserId = user?.id ?? null;

  await Promise.all([
    queryClient.prefetchQuery(articleQueries.detail(articleId, currentUserId)),
    queryClient.prefetchQuery(commentQueries.list(articleId)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleDetailPageView articleId={articleId} currentUserId={currentUserId} />
    </HydrationBoundary>
  );
};

export default ArticlePage;

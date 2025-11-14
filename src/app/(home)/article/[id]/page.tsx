import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { commentQueries } from "@/entities/comment/api/queries";
import { getUserIdFromMiddleware } from "@/shared/lib/helpers/server-helper";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ArticleDetailPageView } from "@/views/article/article-detail-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ArticlePage = async ({ params }: PageProps) => {
  console.time("ArticlePage Total");
  const { id } = await params;
  const articleId = Number(id);
  const queryClient = getQueryClient();
  console.time("Auth Check");
  const userId = await getUserIdFromMiddleware();
  console.timeEnd("Auth Check");

  console.time("Article, comments prefetch");
  await Promise.all([
    queryClient.prefetchQuery(articleQueries.detail(articleId, userId)),
    queryClient.prefetchQuery(commentQueries.list(articleId)),
  ]);
  console.timeEnd("Article, comments prefetch");
  console.timeEnd("ArticlePage Total");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleDetailPageView articleId={articleId} currentUserId={userId} />
    </HydrationBoundary>
  );
};

export default ArticlePage;

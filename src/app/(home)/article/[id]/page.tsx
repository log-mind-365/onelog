import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { articleQueries } from "@/entities/article/api/queries";
import { commentQueries } from "@/entities/comment/api/queries";
import { followQueries } from "@/entities/follow/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ArticleDetailPageView } from "@/views/article/article-detail-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ArticlePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  const user = await getCurrentUser();
  const userId = user?.id ?? null;

  const [article] = await Promise.all([
    queryClient.fetchQuery(articleQueries.detail(id, userId)),
    queryClient.prefetchQuery(commentQueries.list(id)),
  ]);

  await queryClient.prefetchQuery(
    followQueries.isFollowing(userId, article.author?.id ?? ""),
  );
  await queryClient.prefetchQuery(
    followQueries.stats(article.author?.id ?? ""),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleDetailPageView id={id} userId={userId} />
    </HydrationBoundary>
  );
};

export default ArticlePage;

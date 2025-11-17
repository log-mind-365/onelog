import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserIdFromProxy } from "@/shared/lib/helpers/server-helper";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ArticleEditPageView } from "@/views/article/article-edit-page-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ArticleEditPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const articleId = Number(id);
  const queryClient = getQueryClient();
  const userId = await getUserIdFromProxy();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleEditPageView id={articleId} userId={userId} />
    </HydrationBoundary>
  );
};

export default ArticleEditPage;

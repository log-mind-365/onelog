import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getArticleDetail } from "@/entities/article/api/server";
import { Container } from "@/shared/components/container";
import { Separator } from "@/shared/components/ui/separator";
import { ArticleCardContent } from "@/widgets/card/article-card-content";
import { ArticleCardHeader } from "@/widgets/card/article-card-header";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ArticlePage = async ({ params }: PageProps) => {
  const { id } = await params;

  const article = await getArticleDetail(id);

  if (!article) {
    notFound();
  }

  return (
    <Suspense fallback={<p>loading...</p>}>
      <Container.Body>
        <Container.Title title="게시글" description="게시글 상세 내용" />

        <ArticleCardHeader
          userId={article?.author?.id ?? ""}
          userName={article?.author?.userName ?? ""}
          avatarUrl={article?.author?.avatarUrl ?? ""}
          email={article?.author?.email ?? ""}
          emotionLevel={article.emotionLevel}
          createdAt={article.createdAt}
          isMe={false}
        />
        <Separator />
      </Container.Body>
    </Suspense>
  );
};

export default ArticlePage;

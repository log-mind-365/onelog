import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getArticleDetail } from "@/entities/article/api/server";
import { ArticleCardContent } from "@/entities/article/ui/article-card-content";
import { ArticleCardHeader } from "@/entities/article/ui/article-card-header";
import { Container } from "@/shared/components/container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

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
        <TransitionContainer.FadeIn>
          <Container.Title title="게시글" description="게시글 상세 내용" />

          <Card>
            <ArticleCardHeader
              author={article.author}
              emotionLevel={article.emotionLevel}
              accessType={article.accessType}
              createdAt={article.createdAt}
            />
            <Separator />
            <ArticleCardContent
              id={article.id}
              content={article.content}
              author={article.author}
            />
          </Card>
        </TransitionContainer.FadeIn>
      </Container.Body>
    </Suspense>
  );
};

export default ArticlePage;

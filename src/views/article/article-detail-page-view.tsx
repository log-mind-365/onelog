import { PageContainer } from "@/shared/components/page-container";
import { ArticleCommentSection } from "@/views/article/article-comment-section";
import { ArticleDetailPageActionbar } from "@/views/article/article-detail-page-actionbar";
import { ArticleDetailPageContent } from "@/views/article/article-detail-page-content";

type ArticleDetailPageView = {
  id: string;
  userId: string | null;
};

export const ArticleDetailPageView = ({ id, userId }: ArticleDetailPageView) => {
  return (
    <PageContainer>
      <ArticleDetailPageActionbar userId={userId} articleId={id} />
      <ArticleDetailPageContent userId={userId} articleId={id} />
      <ArticleCommentSection articleId={id} userId={userId} />
    </PageContainer>
  );
};

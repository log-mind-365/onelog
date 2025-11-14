import { PageContainer } from "@/shared/components/page-container";
import { ArticleCommentSection } from "@/views/article/article-comment-section";
import { ArticleDetailPageActionbar } from "@/views/article/article-detail-page-actionbar";
import { ArticleDetailPageContent } from "@/views/article/article-detail-page-content";

type ArticleDetailPageView = {
  articleId: number;
  currentUserId: string | null;
};

export const ArticleDetailPageView = ({
  articleId,
  currentUserId,
}: ArticleDetailPageView) => {
  return (
    <PageContainer>
      <ArticleDetailPageActionbar
        currentUserId={currentUserId}
        articleId={articleId}
      />
      <ArticleDetailPageContent
        currentUserId={currentUserId}
        articleId={articleId}
      />
      <ArticleCommentSection articleId={articleId} userId={currentUserId} />
    </PageContainer>
  );
};

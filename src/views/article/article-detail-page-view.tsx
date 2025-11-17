import { ArticleDetailPageActionbar } from "@/features/article/ui/article-detail-page-actionbar";
import { ArticleDetailPageContent } from "@/features/article/ui/article-detail-page-content";
import { ArticleCommentSection } from "@/features/comment/ui/article-comment-section";
import { PageContainer } from "@/shared/components/page-container";

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
      <ArticleCommentSection
        articleId={articleId}
        currentUserId={currentUserId}
      />
    </PageContainer>
  );
};

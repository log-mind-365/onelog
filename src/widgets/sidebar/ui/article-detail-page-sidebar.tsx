"use client";

import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { ArticleOptionsDropdownMenu } from "@/entities/article/ui/article-option-button";
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { ShareArticleButton } from "@/features/article/ui/share-article-button";
import { Container } from "@/shared/components/container";
import { Separator } from "@/shared/components/ui/separator";

export const ArticleDetailPageSidebar = () => {
  return (
    <Container.Sidebar>
      <ArticleLikeButton onClick={() => null} />
      <ArticleCommentButton onClick={() => null} />
      <Separator />
      <ArticleAccessTypeButton />
      <ShareArticleButton onClick={() => null} />
      <ArticleReportButton onClick={onReport} />
      <ArticleOptionsDropdownMenu onDelete={onDelete} onModify={onModify} />
    </Container.Sidebar>
  );
};

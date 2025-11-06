"use client";

import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleCommentButton } from "@/entities/article/ui/article-comment-button";
import { ArticleLikeButton } from "@/entities/article/ui/article-like-button";
import { SidebarContainer } from "@/shared/components/sidebar-container";
import { Separator } from "@/shared/components/ui/separator";

export const ArticleDetailPageSidebar = () => {
  return (
    <SidebarContainer>
      <ArticleLikeButton onClick={() => null} />
      <ArticleCommentButton onClick={() => null} />
      <Separator />
      <ArticleAccessTypeButton />
      {/*<ShareArticleButton onClick={() => null} />*/}
      {/*<ArticleReportButton onClick={onReport} />*/}
      {/*<ArticleOptionsDropdownMenu onDelete={onDelete} onModify={onModify} />*/}
    </SidebarContainer>
  );
};

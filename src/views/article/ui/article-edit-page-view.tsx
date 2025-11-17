"use client";

import { useModal } from "@/app/_store/modal-store";
import {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderEmotionGauge,
  ArticleHeaderUserInfo,
} from "@/entities/article/ui/article-header";
import { ArticleForm } from "@/features/article/ui/article-form";
import { PageContainer } from "@/shared/components/page-container";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useArticleEditPage } from "@/views/article/model/use-article-edit-page";
import { WritePageHeader } from "@/widgets/header/write-page-header/ui/write-page-header";

type ArticleEditPageViewProps = {
  id: number;
  userId: string | null;
};

export const ArticleEditPageView = ({
  id,
  userId,
}: ArticleEditPageViewProps) => {
  const { openModal } = useModal();
  const {
    me,
    title,
    content,
    accessType,
    onAccessTypeChange,
    onEmotionLevelChange,
    onContentChange,
    emotionLevel,
    onTitleChange,
  } = useArticleEditPage(id, userId);

  const { userName = "", email = "", avatarUrl = null } = me ?? {};

  return (
    <PageContainer title="게시글 수정" description="게시글을 수정합니다">
      <WritePageHeader
        accessType={accessType}
        onAccessTypeChange={onAccessTypeChange}
        emotionLevel={emotionLevel}
        onEmotionLevelChange={onEmotionLevelChange}
        openModal={openModal}
        title={title}
        content={content}
        authorId={me?.id ?? ""}
      />
      <Card>
        <CardHeader>
          <ArticleHeader>
            <ArticleHeaderAvatar userName={userName} avatarUrl={avatarUrl} />
            <ArticleHeaderUserInfo userName={userName} email={email} />
            <ArticleHeaderEmotionGauge emotionLevel={emotionLevel} />
          </ArticleHeader>
        </CardHeader>
        <Separator />
        <CardContent>
          <ArticleForm
            title={title}
            content={content}
            onContentChange={onContentChange}
            onTitleChange={onTitleChange}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

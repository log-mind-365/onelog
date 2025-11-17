"use client";

import {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderEmotionGauge,
  ArticleHeaderUserInfo,
} from "@/entities/article/ui/article-header";
import { ArticleForm } from "@/features/article/ui/article-form";
import { PageContainer } from "@/shared/components/page-container";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { useWritePage } from "@/views/write/model/use-write-page";
import { WritePageHeader } from "@/widgets/header/write-page-header/ui/write-page-header";

export const WritePageView = () => {
  const {
    accessType,
    onAccessTypeChange,
    onContentChange,
    onTitleChange,
    onEmotionLevelChange,
    title,
    content,
    emotionLevel,
    userName,
    avatarUrl,
    openModal,
    email,
    currentUserId,
  } = useWritePage();

  return (
    <PageContainer title="게시글 작성" description="오늘은 어떤 일이 있었나요?">
      <WritePageHeader
        accessType={accessType}
        onAccessTypeChange={onAccessTypeChange}
        emotionLevel={emotionLevel}
        onEmotionLevelChange={onEmotionLevelChange}
        openModal={openModal}
        title={title}
        content={content}
        authorId={currentUserId}
      />
      <Card>
        <CardHeader>
          <ArticleHeader>
            <ArticleHeaderAvatar userName={userName} avatarUrl={avatarUrl} />
            <ArticleHeaderUserInfo
              userName={userName}
              email={email}
              createdAt={new Date()}
            />
            <ArticleHeaderEmotionGauge emotionLevel={emotionLevel} />
          </ArticleHeader>
        </CardHeader>
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

"use client";

import type { ChangeEvent } from "react";
import { useModal } from "@/app/_store/modal-store";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";
import {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderEmotionGauge,
  ArticleHeaderUserInfo,
} from "@/entities/article/ui/article-header";
import { ArticleForm } from "@/features/article/ui/article-form";
import { useAuth } from "@/features/auth/model/store";
import { useDraft } from "@/features/write-article/model/use-draft";
import { PageContainer } from "@/shared/components/page-container";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { WritePageHeader } from "@/widgets/header/write-page-header/ui/write-page-header";

export const WritePageView = () => {
  const { me } = useAuth();
  const { openModal } = useModal();
  const { setTitle, setContent, setAccessType, setEmotionLevel } = useDraft();
  const title = useDraft((state) => state.title);
  const content = useDraft((state) => state.content);
  const accessType = useDraft((state) => state.accessType);
  const emotionLevel = useDraft((state) => state.emotionLevel);

  const handleAccessTypeChange = (value: string) => {
    setAccessType(value as AccessType);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleEmotionLevelChange = (value: EmotionLevel) => {
    setEmotionLevel(value);
  };

  const { userName = "", email = "", avatarUrl = null } = me ?? {};

  return (
    <PageContainer title="게시글 작성" description="오늘은 어떤 일이 있었나요?">
      <WritePageHeader
        accessType={accessType}
        onAccessTypeChange={handleAccessTypeChange}
        emotionLevel={emotionLevel}
        onEmotionLevelChange={handleEmotionLevelChange}
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
        <CardContent>
          <ArticleForm
            title={title}
            content={content}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

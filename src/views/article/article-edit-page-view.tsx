"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useModal } from "@/app/_store/modal-store";
import { articleQueries } from "@/entities/article/api/queries";
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
import { Separator } from "@/shared/components/ui/separator";
import { WritePageHeader } from "@/widgets/write-page-header/ui/write-page-header";

type ArticleEditPageViewProps = {
  id: string;
  userId: string | null;
};

export const ArticleEditPageView = ({
  id,
  userId,
}: ArticleEditPageViewProps) => {
  const { openModal } = useModal();
  const { me } = useAuth();
  const { setTitle, setContent, setEmotionLevel, setAccessType, reset } =
    useDraft();
  const { data: article } = useSuspenseQuery(articleQueries.detail(id, userId));
  const title = useDraft((state) => state.title);
  const emotionLevel = useDraft((state) => state.emotionLevel);
  const content = useDraft((state) => state.content);
  const accessType = useDraft((state) => state.accessType);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setEmotionLevel(article.emotionLevel);
      setAccessType(article.accessType);
    }

    return () => {
      reset();
    };
  }, [article, setTitle, setContent, setEmotionLevel, setAccessType, reset]);

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
    <PageContainer title="게시글 수정" description="게시글을 수정합니다">
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
        <Separator />
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

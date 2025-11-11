"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { ArticleForm } from "@/features/article/ui/article-form";
import { useAuth } from "@/features/auth/model/store";
import { PageContainer } from "@/shared/components/page-container";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ArticleEditPageHeader } from "@/views/article/article-edit-page-header.widget";
import { useDraft } from "@/views/write/use-draft";

type ArticleEditPageViewProps = {
  id: string;
  userId: string | null;
};

export const ArticleEditPageView = ({
  id,
  userId,
}: ArticleEditPageViewProps) => {
  const { data: article } = useSuspenseQuery(articleQueries.detail(id, userId));
  const { setTitle, setContent, setEmotionLevel, setAccessType, reset } =
    useDraft();
  const title = useDraft((state) => state.title);
  const emotionLevel = useDraft((state) => state.emotionLevel);
  const content = useDraft((state) => state.content);
  const { me } = useAuth();

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

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <PageContainer title="게시글 수정" description="게시글을 수정합니다">
      <ArticleEditPageHeader articleId={id} />
      <Card>
        <CardHeader>
          <ArticleHeader
            userName={me?.userName ?? ""}
            avatarUrl={me?.avatarUrl ?? ""}
            email={me?.email ?? ""}
            emotionLevel={emotionLevel}
          />
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

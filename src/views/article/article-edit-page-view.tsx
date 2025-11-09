"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { useAuth } from "@/features/auth/model/store";
import { PageContainer } from "@/shared/components/page-container";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ArticleEditPageHeader } from "@/views/article/article-edit-page-header.widget";
import { useDraft } from "@/views/write/use-draft";
import { WritePageBodyHeader } from "@/views/write/write-page-body-header.widget";

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
    <PageContainer>
      <ArticleEditPageHeader articleId={id} />

      <WritePageBodyHeader
        avatarUrl={me?.avatarUrl}
        userName={me?.userName}
        email={me?.email}
        createdAt={me?.createdAt}
        emotionLevel={emotionLevel}
      />
      <div className="flex flex-col rounded-lg border bg-card p-4">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          className="!text-lg rounded-t-lg border-0 font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="오늘은 어떤 일이 있었나요?"
          className="h-40 resize-none rounded-b-lg border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </PageContainer>
  );
};

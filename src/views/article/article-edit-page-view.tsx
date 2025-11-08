"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { useAuth } from "@/features/auth/model/store";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ArticleEditPageHeader } from "@/views/article/article-edit-page-header.widget";
import { useArticleFormStore } from "@/views/write/use-article-form-store";
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
    useArticleFormStore();
  const title = useArticleFormStore((state) => state.title);
  const emotionLevel = useArticleFormStore((state) => state.emotionLevel);
  const content = useArticleFormStore((state) => state.content);
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
    <div className="m-2 flex flex-col gap-4">
      <ArticleEditPageHeader articleId={id} />

      <WritePageBodyHeader
        avatarUrl={me?.avatarUrl}
        userName={me?.userName}
        email={me?.email}
        createdAt={me?.createdAt}
        emotionLevel={emotionLevel}
      />
      <div className="flex flex-col rounded-lg border bg-card">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          className="border-0 rounded-t-lg font-semibold text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="오늘은 어떤 일이 있었나요?"
          className="h-40 resize-none border-0 rounded-b-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};

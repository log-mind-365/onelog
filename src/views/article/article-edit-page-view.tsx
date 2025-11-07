"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { useAuth } from "@/features/auth/model/store";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useArticleFormStore } from "@/views/write/use-article-form-store";
import { WritePageBodyHeader } from "@/views/write/write-page-body-header.widget";
import { ArticleEditPageHeader } from "@/views/article/article-edit-page-header.widget";

type ArticleEditPageViewProps = {
  id: string;
  userId: string | null;
};

export const ArticleEditPageView = ({
  id,
  userId,
}: ArticleEditPageViewProps) => {
  const { data: article } = useSuspenseQuery(articleQueries.detail(id, userId));
  const { setContent, setEmotionLevel, setAccessType, reset } =
    useArticleFormStore();
  const emotionLevel = useArticleFormStore((state) => state.emotionLevel);
  const content = useArticleFormStore((state) => state.content);
  const { me } = useAuth();

  useEffect(() => {
    if (article) {
      setContent(article.content);
      setEmotionLevel(article.emotionLevel);
      setAccessType(article.accessType);
    }

    return () => {
      reset();
    };
  }, [article, setContent, setEmotionLevel, setAccessType, reset]);

  const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
      <Separator />
      <Textarea
        value={content}
        onChange={handleValueChange}
        placeholder="오늘은 어떤 일이 있었나요?"
        className="h-40 resize-none border bg-card shadow-none"
      />
    </div>
  );
};

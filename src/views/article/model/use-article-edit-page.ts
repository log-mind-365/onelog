import { useSuspenseQuery } from "@tanstack/react-query";
import { type ChangeEvent, useEffect } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";
import { useAuth } from "@/features/auth/model/store";
import { useDraft } from "@/features/write-article/model/use-draft";

export const useArticleEditPage = (
  articleId: number,
  currentUserId: string | null,
) => {
  const { me } = useAuth();
  const { setTitle, setContent, setEmotionLevel, setAccessType, reset } =
    useDraft();
  const { data: article } = useSuspenseQuery(
    articleQueries.detail(articleId, currentUserId),
  );
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

  return {
    me,
    title,
    content,
    emotionLevel,
    accessType,
    onAccessTypeChange: handleAccessTypeChange,
    onTitleChange: handleTitleChange,
    onContentChange: handleContentChange,
    onEmotionLevelChange: handleEmotionLevelChange,
  };
};

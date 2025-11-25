import type { ChangeEvent } from "react";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";
import { useAuth } from "@/features/auth/model/store";
import { useDraft } from "@/features/write-article/model/use-draft";
import { useModal } from "@/shared/store/modal-store";

export const useWritePage = () => {
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

  const { userName = "", email = "", avatarUrl = null, id = "" } = me ?? {};

  return {
    userName,
    email,
    avatarUrl,
    openModal,
    currentUserId: id,
    title,
    content,
    accessType,
    emotionLevel,
    onAccessTypeChange: handleAccessTypeChange,
    onTitleChange: handleTitleChange,
    onContentChange: handleContentChange,
    onEmotionLevelChange: handleEmotionLevelChange,
  };
};

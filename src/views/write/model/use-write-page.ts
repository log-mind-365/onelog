import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/model/store";
import { useDraft } from "@/features/write-article/lib/use-draft";
import { articleFormSchema } from "@/features/write-article/model/schemas";
import type { ArticleInsertSchema } from "@/features/write-article/model/types";
import { useModal } from "@/shared/store/modal-store";

export const useWritePage = () => {
  const { me } = useAuth();
  const { openModal } = useModal();
  const {
    title: initialTitle,
    content: initialContent,
    accessType: initialAccessType,
    emotionLevel: initialEmotionLevel,
    setTitle,
    setContent,
    setAccessType,
    setEmotionLevel,
  } = useDraft();

  const form = useForm<ArticleInsertSchema>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: initialTitle,
      content: initialContent,
      accessType: initialAccessType,
      emotionLevel: initialEmotionLevel,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.title !== undefined) setTitle(value.title);
      if (value.content !== undefined) setContent(value.content);
      if (value.accessType !== undefined) setAccessType(value.accessType);
      if (value.emotionLevel !== undefined) setEmotionLevel(value.emotionLevel);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setAccessType, setContent, setEmotionLevel, setTitle]);

  const { userName = "", email = "", avatarUrl = null, id = "" } = me ?? {};

  return {
    userName,
    email,
    avatarUrl,
    openModal,
    currentUserId: id,
    form,
  };
};

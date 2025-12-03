import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";

type DraftStore = {
  title: string;
  content: string;
  emotionLevel: EmotionLevel;
  accessType: AccessType;
  userId: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setEmotionLevel: (emotionLevel: EmotionLevel) => void;
  setAccessType: (accessType: AccessType) => void;
  setUserId: (userId: string) => void;
  reset: () => void;
};

export const useDraft = create<DraftStore>()(
  persist(
    (set) => ({
      title: "",
      content: "",
      emotionLevel: 3,
      accessType: "public",
      userId: "",
      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setEmotionLevel: (emotionLevel) => set({ emotionLevel }),
      setAccessType: (accessType) => set({ accessType }),
      setUserId: (userId) => set({ userId }),
      reset: () =>
        set({ title: "", content: "", emotionLevel: 3, accessType: "public" }),
    }),
    {
      name: "draft-storage",
      partialize: (state) => ({
        title: state.title,
        content: state.content,
        emotionLevel: state.emotionLevel,
        accessType: state.accessType,
        userId: state.userId,
      }),
    },
  ),
);

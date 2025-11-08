import { create } from "zustand";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";

type ArticleFormStore = {
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

export const useArticleFormStore = create<ArticleFormStore>((set) => ({
  title: "",
  content: "",
  emotionLevel: 50,
  accessType: "public",
  userId: "",
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setEmotionLevel: (emotionLevel) => set({ emotionLevel }),
  setAccessType: (accessType) => set({ accessType }),
  setUserId: (userId) => set({ userId }),
  reset: () => set({ title: "", content: "", emotionLevel: 50, accessType: "public" }),
}));

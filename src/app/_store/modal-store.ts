import { create } from "zustand";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";

export type ModalType =
  | "sign-in"
  | "sign-up"
  | "auth-guard"
  | "submit-article"
  | "update-article"
  | "report-article"
  | "sign-out"
  | null;

export type ModalProps =
  | SubmitArticleDialogProps
  | UpdateArticleDialogProps
  | ReportArticleDialogProps
  | null;

export type SubmitArticleDialogProps = {
  authorId?: string;
  title: string;
  content: string;
  emotionLevel: EmotionLevel;
  accessType: AccessType;
};

export type UpdateArticleDialogProps = {
  id: string;
  title: string;
  content: string;
  emotionLevel: EmotionLevel;
  accessType: AccessType;
};

export type ReportArticleDialogProps = {
  articleId: string;
  reporterId: string;
};

type ModalStore = {
  currentModal: ModalType;
  openModal: (currentModal: ModalType, props?: ModalProps) => void;
  closeModal: () => void;
  props: ModalProps | null;
};

export const useModal = create<ModalStore>((set) => ({
  currentModal: null,
  props: null,
  openModal: (currentModal, props) =>
    set({ currentModal, props: props ?? null }),
  closeModal: () => set({ currentModal: null }),
}));

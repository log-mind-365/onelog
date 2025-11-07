import { create } from "zustand";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";

export type ModalType =
  | "sign-in"
  | "sign-up"
  | "auth-guard"
  | "submit-article"
  | "sign-out"
  | null;

export type ModalProps = SubmitArticleDialogProps | null;

export type SubmitArticleDialogProps = {
  userId?: string;
  content: string;
  emotionLevel: EmotionLevel;
  accessType: AccessType;
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

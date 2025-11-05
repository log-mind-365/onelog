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

"use client";

import { SubmitArticleModal } from "@/features/article/ui/submit-article-modal";
import { AuthGuardModal } from "@/features/auth/ui/auth-guard-modal";
import { SignInModal } from "@/features/auth/ui/sign-in-modal";
import { SignOutModal } from "@/features/auth/ui/sign-out-modal";
import { SignUpModal } from "@/features/auth/ui/sign-up-modal";
import { Dialog } from "@/shared/components/ui/dialog";
import { useModal } from "@/app/providers/modal-store";

export const Modal = () => {
  const { currentModal, closeModal } = useModal();

  if (currentModal === null) return null;

  return (
    <Dialog
      open={!!currentModal}
      onOpenChange={(open) => !open && closeModal()}
    >
      {currentModal === "sign-up" && <SignUpModal />}
      {currentModal === "sign-in" && <SignInModal />}
      {currentModal === "sign-out" && <SignOutModal />}
      {currentModal === "submit-article" && <SubmitArticleModal />}
      {currentModal === "auth-guard" && <AuthGuardModal />}
    </Dialog>
  );
};

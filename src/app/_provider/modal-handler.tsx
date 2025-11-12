"use client";

import { useModal } from "@/app/_store/modal-store";
import { ReportArticleDialog } from "@/features/article/ui/report-article-dialog";
import { SubmitArticleModal } from "@/features/article/ui/submit-article-modal";
import { UpdateArticleModal } from "@/features/article/ui/update-article-modal";
import { AuthGuardModal } from "@/features/auth/ui/auth-guard-modal";
import { SignInModal } from "@/features/auth/ui/sign-in-modal";
import { SignOutModal } from "@/features/auth/ui/sign-out-modal";
import { SignUpModal } from "@/features/auth/ui/sign-up-modal";
import { Dialog } from "@/shared/components/ui/dialog";

export const ModalHandler = () => {
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
      {currentModal === "update-article" && <UpdateArticleModal />}
      {currentModal === "report-article" && <ReportArticleDialog />}
      {currentModal === "auth-guard" && <AuthGuardModal />}
    </Dialog>
  );
};

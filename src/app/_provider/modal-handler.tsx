"use client";

import { useModal } from "@/app/_store/modal-store";
import { ReportArticleDialog } from "@/features/article/ui/report-article-dialog";
import { AuthGuardModal } from "@/features/auth/ui/auth-guard-modal";
import { SignInModal } from "@/features/auth/ui/sign-in-modal";
import { SignOutModal } from "@/features/auth/ui/sign-out-modal";
import { SignUpModal } from "@/features/auth/ui/sign-up-modal";
import { Dialog } from "@/shared/components/ui/dialog";
import { SubmitArticleModal } from "@/widgets/modal/submit-article-modal";
import { UpdateArticleModal } from "@/widgets/modal/update-article-modal";

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

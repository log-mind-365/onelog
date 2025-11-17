"use client";

import { useModal } from "@/app/_store/modal-store";
import { Dialog } from "@/shared/components/ui/dialog";
import { AuthGuardModal } from "@/widgets/modal/auth-guard-modal";
import { ReportArticleModal } from "@/widgets/modal/report-article-modal";
import { SignOutModal } from "@/widgets/modal/sign-out-modal";
import { SubmitArticleModal } from "@/widgets/modal/submit-article-modal";
import { UpdateArticleModal } from "@/widgets/modal/update-article-modal";

export const ModalProvider = () => {
  const { currentModal, closeModal } = useModal();

  if (currentModal === null) return null;

  return (
    <Dialog
      open={!!currentModal}
      onOpenChange={(open) => !open && closeModal()}
    >
      {currentModal === "sign-out" && <SignOutModal />}
      {currentModal === "submit-article" && <SubmitArticleModal />}
      {currentModal === "update-article" && <UpdateArticleModal />}
      {currentModal === "report-article" && <ReportArticleModal />}
      {currentModal === "auth-guard" && <AuthGuardModal />}
    </Dialog>
  );
};

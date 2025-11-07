"use client";

import type { PropsWithChildren } from "react";
import { Dialog } from "@/shared/components/ui/dialog";
import { useModal, type ModalType } from "@/app/providers/modal-store";

type ModalProps = PropsWithChildren & {
  type: ModalType;
};

export const Modal = ({ type, children }: ModalProps) => {
  const { currentModal, closeModal } = useModal();

  if (currentModal !== type || currentModal === null) return null;

  return (
    <Dialog
      open={currentModal === type}
      onOpenChange={(open) => !open && closeModal()}
    >
      {children}
    </Dialog>
  );
};

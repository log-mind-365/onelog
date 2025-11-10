"use client";

import type { PropsWithChildren } from "react";
import { type ModalType, useModal } from "@/app/_store/modal-store";
import { Dialog } from "@/shared/components/ui/dialog";

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

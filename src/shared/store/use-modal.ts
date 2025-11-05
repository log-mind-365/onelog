import { create } from "zustand";
import type { ModalProps, ModalType } from "@/shared/model/types";

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

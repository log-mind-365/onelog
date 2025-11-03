import { create } from "zustand";
import type { ModalType } from "@/shared/model/types";

type ModalStore = {
  currentModal: ModalType;
  openModal: (currentModal: ModalType) => void;
  closeModal: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  currentModal: null,
  openModal: (currentModal) => set({ currentModal }),
  closeModal: () => set({ currentModal: null }),
}));

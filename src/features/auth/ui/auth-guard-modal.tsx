"use client";

import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useModal } from "@/shared/store/use-modal";

export const AuthGuardModal = () => {
  const { currentModal, openModal, closeModal } = useModal();

  if (currentModal !== "auth-guard") return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>로그인이 필요합니다.</DialogTitle>
        <DialogDescription>
          이 기능을 사용하려면 로그인이 필요합니다.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="secondary" onClick={closeModal}>
          취소
        </Button>
        <Button onClick={() => openModal("sign-in")}>로그인 하러가기</Button>
      </DialogFooter>
    </DialogContent>
  );
};

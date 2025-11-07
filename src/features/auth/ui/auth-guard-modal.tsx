"use client";

import { useModal } from "@/app/_providers/modal-store";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

export const AuthGuardModal = () => {
  const { openModal, closeModal } = useModal();

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

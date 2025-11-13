"use client";

import { useRouter } from "next/navigation";
import { useModal } from "@/app/_store/modal-store";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ROUTES } from "@/shared/model/routes";

export const AuthGuardModal = () => {
  const { closeModal } = useModal();
  const router = useRouter();

  const handleViewSignIn = () => {
    router.push(ROUTES.AUTH.SIGN_IN);
    closeModal();
  };

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
        <Button onClick={handleViewSignIn}>로그인 하러가기</Button>
      </DialogFooter>
    </DialogContent>
  );
};

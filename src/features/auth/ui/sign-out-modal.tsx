"use client";

import { useSignOut } from "@/features/auth/lib/use-sign-out";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useModal } from "@/shared/store/use-modal";

export const SignOutModal = () => {
  const { currentModal, closeModal } = useModal();
  const { mutate: signOut } = useSignOut();

  if (currentModal !== "sign-out") return null;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>로그아웃</DialogTitle>
        <DialogDescription>정말로 로그아웃 하시겠습니까?</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={handleSignOut}>로그아웃</Button>
        <Button variant="outline" onClick={closeModal}>
          취소
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

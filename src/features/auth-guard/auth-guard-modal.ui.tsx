"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import type { PropsWithChildren } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

type AuthGuardModalProps = PropsWithChildren &
  DialogProps & {
    onSignInClick: () => void;
  };

export const AuthGuardModal = ({
  children,
  open,
  onOpenChange,
  onSignInClick,
}: AuthGuardModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그인이 필요합니다.</DialogTitle>
          <DialogDescription>
            이 기능을 사용하려면 로그인이 필요합니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onSignInClick}>로그인 하러가기</Button>
          <Button variant="secondary" onClick={() => onOpenChange?.(false)}>
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

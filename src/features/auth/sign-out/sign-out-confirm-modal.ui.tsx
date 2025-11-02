import type { DialogProps } from "@radix-ui/react-dialog";
import type { PropsWithChildren } from "react";
import { useSignOut } from "@/features/auth/sign-out/sign-out.mutation";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

type SignOutConfirmModalProps = PropsWithChildren & DialogProps & {};

export const SignOutConfirmModal = ({
  open,
  onOpenChange,
  children,
}: SignOutConfirmModalProps) => {
  const { mutate: signOut } = useSignOut();

  const handleSignOut = () => {
    signOut();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그아웃</DialogTitle>
        </DialogHeader>
        정말로 로그아웃 하시겠습니까?
        <DialogFooter>
          <Button>로그아웃</Button>
          <Button variant="outline">취소</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

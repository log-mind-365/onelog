import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { User, UserPlus } from "lucide-react";
import type { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useModal } from "@/shared/store/use-modal";

type UnauthenticatedDropdownMenuProps = PropsWithChildren & DropdownMenuProps;

export const UnauthenticatedDropdownMenu = ({
  open,
  onOpenChange,
  children,
}: UnauthenticatedDropdownMenuProps) => {
  const { openModal } = useModal();
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      {children && (
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem onClick={() => openModal("sign-up")}>
          <UserPlus />
          회원가입
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openModal("sign-in")}>
          <User />
          로그인
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

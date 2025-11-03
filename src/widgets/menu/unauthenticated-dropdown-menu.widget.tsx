import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { User, UserPlus } from "lucide-react";
import type { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type UnauthenticatedDropdownMenuProps = PropsWithChildren &
  DropdownMenuProps & {
    onSwitchToSignIn?: () => void;
    onSwitchToSignUp?: () => void;
  };

export const UnauthenticatedDropdownMenu = ({
  open,
  onOpenChange,
  onSwitchToSignIn,
  onSwitchToSignUp,
  children,
}: UnauthenticatedDropdownMenuProps) => {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      {children && (
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem onClick={onSwitchToSignUp}>
          <UserPlus />
          회원가입
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSwitchToSignIn}>
          <User />
          로그인
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

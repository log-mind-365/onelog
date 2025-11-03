import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import type { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type AuthenticatedDropdownMenuProps = PropsWithChildren &
  DropdownMenuProps & {};

export const AuthenticatedDropdownMenu = ({
  open,
  onOpenChange,
  children,
}: AuthenticatedDropdownMenuProps) => {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      {children && <DropdownMenuTrigger>{children}</DropdownMenuTrigger>}
    </DropdownMenu>
  );
};

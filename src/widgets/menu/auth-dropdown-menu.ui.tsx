import type { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type AuthDropdownMenuProps = PropsWithChildren & {};

export const AuthDropdownMenu = ({ children }: AuthDropdownMenuProps) => {
  return (
    <DropdownMenu>
      {children && <DropdownMenuTrigger>{children}</DropdownMenuTrigger>}
      <DropdownMenuContent>
        <DropdownMenuLabel></DropdownMenuLabel>
        <DropdownMenuItem></DropdownMenuItem>
        <DropdownMenuItem></DropdownMenuItem>
        <DropdownMenuItem></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

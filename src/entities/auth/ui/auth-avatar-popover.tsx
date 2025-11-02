import type { PropsWithChildren } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type AuthAvatarPopoverProps = PropsWithChildren & {
  userName?: string;
  email?: string;
  signOut?: () => void;
};

export const AuthAvatarPopover = ({ children }: AuthAvatarPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent></PopoverContent>
    </Popover>
  );
};

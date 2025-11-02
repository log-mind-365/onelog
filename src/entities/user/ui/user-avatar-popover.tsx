import { AvatarImage } from "@radix-ui/react-avatar";
import type { PropsWithChildren } from "react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type AuthProfilePopoverProps = PropsWithChildren & {
  avatarUrl?: string | null;
  userName?: string;
};

export const UserAvatarPopover = ({
  avatarUrl,
  userName = "John Doe",
  children,
}: AuthProfilePopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="flex w-auto flex-col items-center gap-4"
      >
        <Avatar className="size-10">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>{userName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <h1 className="font-bold">{userName}</h1>
        <div className="flex justify-between gap-4">
          <Button variant="outline">프로필 수정</Button>
          <Button>프로필 페이지</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

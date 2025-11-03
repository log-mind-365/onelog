import type { PropsWithChildren } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { UserBaseInfo } from "@/entities/user/ui/user-base-info";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type UserProfilePopoverMenuProps = PropsWithChildren & {
  avatarUrl?: string | null;
  userName?: string;
  email?: string;
};

export const UserProfilePopoverMenu = ({
  avatarUrl,
  userName = "John Doe",
  email = "dolosolo@naver.com",
  children,
}: UserProfilePopoverMenuProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="flex w-auto flex-col items-center gap-4"
      >
        <UserAvatar size="lg" avatarUrl={avatarUrl} fallback={userName} />
        <UserBaseInfo userName={userName} email={email} align="center" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            프로필 수정
          </Button>
          <Button size="sm">프로필 페이지</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

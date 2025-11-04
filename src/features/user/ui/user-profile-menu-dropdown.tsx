"use client";

import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useUserProfileMenu } from "@/features/user/lib/use-user-profile-menu";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type UserProfileMenuDropdownProps = {
  userName: string;
  avatarUrl?: string;
};

export const UserProfileMenuDropdown = ({
  userName,
  avatarUrl,
}: UserProfileMenuDropdownProps) => {
  const profileMenuItems = useUserProfileMenu();
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <UserAvatar
                fallback={userName || "U"}
                avatarUrl={avatarUrl}
                size="sm"
              />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>프로필</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {profileMenuItems.map((item, index) => {
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            if (!item) return <DropdownMenuSeparator key={index} />;

            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.id} onClick={item.action}>
                <Icon />
                <p>{item.label}</p>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent side="right">
        <p>프로필</p>
      </TooltipContent>
    </Tooltip>
  );
};

import type { ComponentProps } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { cn } from "@/shared/lib/utils";

type UserDetailInfoProps = ComponentProps<"div"> & {
  userName: string;
  email: string;
  aboutMe: string;
  avatarUrl: string | null;
};

export const UserInfoBase = ({
  userName,
  aboutMe,
  email,
  avatarUrl,
  className,
  children,
}: UserDetailInfoProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between gap-4 p-4",
        className,
      )}
    >
      <UserAvatar fallback={userName} avatarUrl={avatarUrl} size="xl" />
      <div className="flex flex-1 flex-col">
        <h1 className="font-bold text-sm sm:text-lg">{userName}</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">{email}</p>
        <p className="text-xs sm:text-sm">{aboutMe}</p>
      </div>

      {children}
    </div>
  );
};

export const UserInfoBaseActions = ({
  className,
  children,
}: ComponentProps<"div">) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

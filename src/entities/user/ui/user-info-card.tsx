import type { ComponentProps } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { cn } from "@/shared/lib/helpers/client-helper";

const UserInfoCard = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className={cn("flex w-full gap-4 p-4", className)} {...props}>
      {children}
    </div>
  );
};

type UserInfoAvatarProps = ComponentProps<"div"> & {
  userName: string;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const UserInfoCardAvatar = ({
  userName,
  avatarUrl,
  size = "xl",
  className,
  ...props
}: UserInfoAvatarProps) => {
  return (
    <div className={className} {...props}>
      <UserAvatar fallback={userName} avatarUrl={avatarUrl} size={size} />
    </div>
  );
};

const UserInfoCardContent = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-1 gap-4", className)} {...props}>
      {children}
    </div>
  );
};

const UserInfoCardDetails = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-1 flex-col justify-center", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type UserInfoNameProps = ComponentProps<"h1"> & {
  userName: string;
};

const UserInfoCardName = ({
  userName,
  className,
  ...props
}: UserInfoNameProps) => {
  return (
    <h1 className={cn("font-bold text-lg", className)} {...props}>
      {userName}
    </h1>
  );
};

type UserInfoEmailProps = ComponentProps<"p"> & {
  email: string;
};

const UserInfoCardEmail = ({
  email,
  className,
  ...props
}: UserInfoEmailProps) => {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props}>
      {email}
    </p>
  );
};

type UserInfoAboutMeProps = ComponentProps<"p"> & {
  aboutMe: string;
};

const UserInfoCardAboutMe = ({
  aboutMe,
  className,
  ...props
}: UserInfoAboutMeProps) => {
  return (
    <p className={cn("text-sm", className)} {...props}>
      {aboutMe}
    </p>
  );
};

const UserInfoCardActions = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {children}
    </div>
  );
};

export {
  UserInfoCard,
  UserInfoCardAvatar,
  UserInfoCardContent,
  UserInfoCardDetails,
  UserInfoCardName,
  UserInfoCardEmail,
  UserInfoCardAboutMe,
  UserInfoCardActions,
};

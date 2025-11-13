import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { cn } from "@/shared/lib/utils";

const UserInfoBaseRoot = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-row items-center justify-between gap-4 p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
UserInfoBaseRoot.displayName = "UserInfoBase";

type UserInfoAvatarProps = ComponentProps<"div"> & {
  userName: string;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const UserInfoAvatar = forwardRef<HTMLDivElement, UserInfoAvatarProps>(
  ({ userName, avatarUrl, size = "xl", className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <UserAvatar fallback={userName} avatarUrl={avatarUrl} size={size} />
      </div>
    );
  }
);
UserInfoAvatar.displayName = "UserInfoAvatar";

const UserInfoContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-1 flex-col", className)} {...props}>
        {children}
      </div>
    );
  }
);
UserInfoContent.displayName = "UserInfoContent";

type UserInfoNameProps = ComponentProps<"h1"> & {
  userName: string;
};

const UserInfoName = forwardRef<HTMLHeadingElement, UserInfoNameProps>(
  ({ userName, className, ...props }, ref) => {
    return (
      <h1 ref={ref} className={cn("font-bold text-sm sm:text-lg", className)} {...props}>
        {userName}
      </h1>
    );
  }
);
UserInfoName.displayName = "UserInfoName";

type UserInfoEmailProps = ComponentProps<"p"> & {
  email: string;
};

const UserInfoEmail = forwardRef<HTMLParagraphElement, UserInfoEmailProps>(
  ({ email, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-muted-foreground text-xs sm:text-sm", className)} {...props}>
        {email}
      </p>
    );
  }
);
UserInfoEmail.displayName = "UserInfoEmail";

type UserInfoAboutMeProps = ComponentProps<"p"> & {
  aboutMe: string;
};

const UserInfoAboutMe = forwardRef<HTMLParagraphElement, UserInfoAboutMeProps>(
  ({ aboutMe, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-xs sm:text-sm", className)} {...props}>
        {aboutMe}
      </p>
    );
  }
);
UserInfoAboutMe.displayName = "UserInfoAboutMe";

const UserInfoActions = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    );
  }
);
UserInfoActions.displayName = "UserInfoActions";

export const UserInfoBase = Object.assign(UserInfoBaseRoot, {
  Avatar: UserInfoAvatar,
  Content: UserInfoContent,
  Name: UserInfoName,
  Email: UserInfoEmail,
  AboutMe: UserInfoAboutMe,
  Actions: UserInfoActions,
});

// 하위 호환성을 위한 별칭
export const UserInfoBaseActions = UserInfoActions;

import { cva } from "class-variance-authority";
import { User } from "lucide-react";
import { forwardRef } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

import { cn } from "@/shared/lib/helpers/client-helper";

type UserAvatarProps = {
  avatarUrl?: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const userAvatarVariants = cva("border-1 bg-card shadow-sm", {
  variants: {
    size: {
      sm: "size-8",
      md: "size-10",
      lg: "size-16",
      xl: "size-22",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ avatarUrl, fallback, size = "md", ...props }, ref) => {
    return (
      <Avatar ref={ref} className={cn(userAvatarVariants({ size }))} {...props}>
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="select-none bg-card">
          {fallback?.[0]?.toUpperCase() || <User />}
        </AvatarFallback>
      </Avatar>
    );
  },
);

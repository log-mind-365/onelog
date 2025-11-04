import { cva } from "class-variance-authority";
import { User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";

type UserAvatarProps = {
  avatarUrl?: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const userAvatarVariants = cva("", {
  variants: {
    size: {
      sm: "size-6",
      md: "size-10",
      lg: "size-16",
      xl: "size-22",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const UserAvatar = ({
  avatarUrl,
  fallback,
  size = "md",
}: UserAvatarProps) => {
  return (
    <Avatar className={cn(userAvatarVariants({ size }))}>
      <AvatarImage src={avatarUrl || undefined} />
      <AvatarFallback>
        {fallback?.[0]?.toUpperCase() || <User />}
      </AvatarFallback>
    </Avatar>
  );
};

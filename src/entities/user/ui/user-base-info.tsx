import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

type UserBaseInfoProps = ComponentProps<"div"> & {
  userName: string;
  email: string;
  align?: "start" | "center" | "end";
};

const userBaseInfoVariants = cva("flex flex-col gap-1", {
  variants: {
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
  },
  defaultVariants: {
    align: "start",
  },
});

export const UserBaseInfo = ({
  userName,
  email,
  align,
  className,
}: UserBaseInfoProps) => {
  return (
    <div className={cn(userBaseInfoVariants({ align }), className)}>
      <h1 className="font-bold">{userName}</h1>
      <p className="text-muted-foreground text-sm">{email}</p>
    </div>
  );
};

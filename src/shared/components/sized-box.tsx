import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/helpers/client-helper";

const boxSizes = {
  1: "h-1 w-1", // 4px
  2: "h-2 w-2", // 8px
  3: "h-3 w-3", // 12px
  4: "h-4 w-4", // 16px
  6: "h-6 w-6", // 24px
  8: "h-8 w-8", // 32px
  10: "h-10 w-10", // 40px
  12: "h-12 w-12", // 48px
  16: "h-16 w-16", // 64px
} as const;

type SizedBoxProps = ComponentProps<"div"> & {
  size?: keyof typeof boxSizes;
  direction?: "vertical" | "horizontal";
};

export const SizedBox = ({
  size = 4,
  direction = "vertical",
  className,
  ...props
}: SizedBoxProps) => {
  const sizeClasses = boxSizes[size].split(" ");
  const sizeClass = direction === "vertical" ? sizeClasses[0] : sizeClasses[1];

  return (
    <div aria-hidden="true" className={cn(sizeClass, className)} {...props} />
  );
};

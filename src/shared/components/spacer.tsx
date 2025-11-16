import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

type SpacerProps = ComponentProps<"div"> & {
  size?: number;
  direction?: "vertical" | "horizontal";
};

export const Spacer = ({
  size = 16,
  direction = "vertical",
  className,
}: SpacerProps) => {
  const sizeClass = `h-${size}`;
  return (
    <div
      className={cn(
        direction === "horizontal" && sizeClass.replace("h-", "w-"),
        direction === "vertical" && sizeClass,
        className,
      )}
    />
  );
};

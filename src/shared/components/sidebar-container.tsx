import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

export const SidebarContainer = ({
  className,
  children,
}: ComponentProps<"aside">) => {
  return (
    <aside
      className={cn(
        "sticky top-8 hidden h-fit w-auto flex-col gap-2 rounded-lg border-1 bg-card p-2 sm:flex",
        className,
      )}
    >
      {children}
    </aside>
  );
};

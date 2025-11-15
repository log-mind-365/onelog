import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

type BodyProps = ComponentProps<"div"> & {
  bodyVariant?: "default" | "write";
  title?: string;
  description?: string;
  banner?: React.ReactNode;
};

export const PageContainer = ({
  title,
  description,
  className,
  banner,
  children,
}: BodyProps) => (
  <div className={cn("m-2 flex flex-col gap-2 sm:m-4 sm:ml-2", className)}>
    {title && (
      <div className="flex flex-col items-start justify-between">
        <h1 className="font-bold text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        )}
        {banner}
      </div>
    )}
    {children}
  </div>
);

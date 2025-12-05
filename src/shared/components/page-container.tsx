import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/helpers/client-helper";

type BodyProps = ComponentProps<"div"> & {
  bodyVariant?: "default" | "write";
  title?: string;
  description?: string;
};

export const PageContainer = ({
  title,
  description,
  className,
  children,
}: BodyProps) => (
  <main className={cn("m-2 flex flex-col gap-4 sm:m-4", className)}>
    {title && (
      <header className="flex flex-col items-start justify-between">
        <h1 className="font-bold text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        )}
      </header>
    )}
    {children}
  </main>
);

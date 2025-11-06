import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

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
  <div
    className={cn(
      "flex h-[calc(100vh-5.2rem)] w-full flex-col gap-4 px-2 sm:my-8 sm:h-[calc(100vh-4rem)] sm:w-md md:w-lg lg:w-2xl",
      className,
    )}
  >
    {title && (
      <div className="flex flex-col items-start justify-between">
        <h1 className="font-bold text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    )}
    {children}
  </div>
);

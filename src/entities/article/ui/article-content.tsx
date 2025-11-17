import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/helpers/client-helper";

type ArticleCardContentProps = ComponentProps<"div"> & {
  title: string;
  content: string;
};

export const ArticleContent = ({
  title,
  content,
  className,
}: ArticleCardContentProps) => {
  return (
    <div className={cn("relative max-h-64 overflow-hidden", className)}>
      <h2 className="mb-2 font-semibold text-xl">{title}</h2>
      <p className="whitespace-pre-wrap break-words">{content}</p>
    </div>
  );
};

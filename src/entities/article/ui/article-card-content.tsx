import { CardContent } from "@/shared/components/ui/card";

type ArticleCardContentProps = {
  title: string;
  content: string;
};

export const ArticleCardContent = ({
  title,
  content,
}: ArticleCardContentProps) => {
  return (
    <CardContent className="relative max-h-64 overflow-hidden">
      <h2 className="mb-2 line-clamp-2 font-semibold text-xl">{title}</h2>
      <p className="line-clamp-4 whitespace-pre-wrap break-words">{content}</p>
    </CardContent>
  );
};

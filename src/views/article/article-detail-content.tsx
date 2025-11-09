import { CardContent } from "@/shared/components/ui/card";

type ArticleDetailContentProps = {
  title: string;
  content: string;
};

export const ArticleDetailContent = ({
  title,
  content,
}: ArticleDetailContentProps) => {
  return (
    <CardContent className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">{title}</h1>
      <p className="whitespace-pre-wrap break-words">{content}</p>
    </CardContent>
  );
};

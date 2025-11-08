type ArticleDetailContentProps = {
  title: string;
  content: string;
};

export const ArticleDetailContent = ({
  title,
  content,
}: ArticleDetailContentProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="whitespace-pre-wrap break-words">{content}</p>
    </div>
  );
};

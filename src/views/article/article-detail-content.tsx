type ArticleDetailContentProps = {
  content: string;
};

export const ArticleDetailContent = ({
  content,
}: ArticleDetailContentProps) => {
  return <p className="whitespace-pre-wrap break-words">{content}</p>;
};

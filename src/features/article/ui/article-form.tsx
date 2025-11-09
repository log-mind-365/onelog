import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

type ArticleFormProps = {
  title: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  content: string;
  onContentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

export const ArticleForm = ({
  title,
  onTitleChange,
  content,
  onContentChange,
}: ArticleFormProps) => {
  return (
    <>
      <Input
        value={title}
        onChange={onTitleChange}
        placeholder="제목을 입력하세요"
        className="rounded-none border-0 pt-4 font-semibold text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
      />
      <Textarea
        value={content}
        onChange={onContentChange}
        placeholder="오늘은 어떤 일이 있었나요?"
        className="max-h-40 min-h-20 resize-none rounded-none border-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
      />
    </>
  );
};

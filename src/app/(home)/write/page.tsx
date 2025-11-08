"use client";

import type { ChangeEvent } from "react";
import { useAuth } from "@/features/auth/model/store";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useArticleFormStore } from "@/views/write/use-article-form-store";
import { WritePageBodyHeader } from "@/views/write/write-page-body-header.widget";
import { WritePageHeader } from "@/views/write/write-page-header.widget";

const Page = () => {
  const { setTitle, setContent } = useArticleFormStore();
  const title = useArticleFormStore((state) => state.title);
  const emotionLevel = useArticleFormStore((state) => state.emotionLevel);
  const content = useArticleFormStore((state) => state.content);
  const { me } = useAuth();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="m-4 flex flex-col gap-4">
      <WritePageHeader />

      <WritePageBodyHeader
        avatarUrl={me?.avatarUrl}
        userName={me?.userName}
        email={me?.email}
        createdAt={me?.createdAt}
        emotionLevel={emotionLevel}
      />
      <Separator />
      <Input
        value={title}
        onChange={handleTitleChange}
        placeholder="제목을 입력하세요"
        className="border bg-card font-semibold text-lg shadow-none"
      />
      <Textarea
        value={content}
        onChange={handleContentChange}
        placeholder="오늘은 어떤 일이 있었나요?"
        className="h-40 resize-none border bg-card shadow-none"
      />
    </div>
  );
};

export default Page;

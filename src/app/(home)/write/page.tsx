"use client";

import type { ChangeEvent } from "react";
import { useAuth } from "@/features/auth/model/store";
import { PageContainer } from "@/shared/components/page-container";
import { Input } from "@/shared/components/ui/input";
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
    <PageContainer title="게시글 작성" description="오늘은 어떤 일이 있었나요?">
      <WritePageHeader />
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-2">
        <WritePageBodyHeader
          avatarUrl={me?.avatarUrl}
          userName={me?.userName}
          email={me?.email}
          createdAt={me?.createdAt}
          emotionLevel={emotionLevel}
        />
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          className="rounded-none border-0 pt-4 font-semibold text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
        />
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="오늘은 어떤 일이 있었나요?"
          className="max-h-40 min-h-20 resize-none rounded-none border-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
        />
      </div>
    </PageContainer>
  );
};

export default Page;

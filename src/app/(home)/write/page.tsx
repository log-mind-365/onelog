"use client";

import type { ChangeEvent } from "react";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { ArticleForm } from "@/features/article/ui/article-form";
import { useAuth } from "@/features/auth/model/store";
import { PageContainer } from "@/shared/components/page-container";
import { useDraft } from "@/views/write/use-draft";
import { WritePageHeader } from "@/views/write/write-page-header.widget";

const Page = () => {
  const { setTitle, setContent } = useDraft();
  const title = useDraft((state) => state.title);
  const emotionLevel = useDraft((state) => state.emotionLevel);
  const content = useDraft((state) => state.content);
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
        <ArticleHeader
          userId={me?.id ?? ""}
          userName={me?.userName ?? ""}
          avatarUrl={me?.avatarUrl ?? ""}
          email={me?.email ?? ""}
          emotionLevel={emotionLevel}
          isMe={true}
        />
        <ArticleForm
          title={title}
          content={content}
          onContentChange={handleContentChange}
          onTitleChange={handleTitleChange}
        />
      </div>
    </PageContainer>
  );
};

export default Page;

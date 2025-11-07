"use client";

import type { ChangeEvent } from "react";
import { useAuth } from "@/features/auth/model/store";
import { PageContainer } from "@/shared/components/page-container";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useArticleFormStore } from "@/views/write/use-article-form-store";
import { WritePageBodyHeader } from "@/views/write/write-page-body-header.widget";
import { WritePageHeader } from "@/views/write/write-page-header.widget";

const Page = () => {
  const { setContent } = useArticleFormStore();
  const emotionLevel = useArticleFormStore((state) => state.emotionLevel);
  const content = useArticleFormStore((state) => state.content);
  const { me } = useAuth();

  const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="m-2 flex flex-col gap-4">
      <WritePageHeader />

      <WritePageBodyHeader
        avatarUrl={me?.avatarUrl}
        userName={me?.userName}
        email={me?.email}
        createdAt={me?.createdAt}
        emotionLevel={emotionLevel}
      />
      <Separator />
      <Textarea
        value={content}
        onChange={handleValueChange}
        placeholder="오늘은 어떤 일이 있었나요?"
        className="h-40 resize-none border bg-card shadow-none"
      />
    </div>
  );
};

export default Page;

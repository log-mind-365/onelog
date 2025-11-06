"use client";

import type { ChangeEvent } from "react";
import { PageContainer } from "@/shared/components/page-container";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAuth } from "@/shared/store/use-auth";
import { useArticleFormStore } from "@/views/write/use-article-form-store";
import { WritePageBodyHeader } from "@/views/write/write-page-body-header.widget";

const Page = () => {
  const { setContent } = useArticleFormStore();
  const emotionLevel = useArticleFormStore((state) => state.emotionLevel);
  const content = useArticleFormStore((state) => state.content);
  const { me } = useAuth();

  const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <PageContainer className="my-2">
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
        className="h-full resize-none border-none shadow-none"
      />
    </PageContainer>
  );
};

export default Page;

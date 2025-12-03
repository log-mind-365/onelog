"use client";

import {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderEmotionGauge,
  ArticleHeaderUserInfo,
} from "@/entities/article/ui/article-header";
import { ArticleForm } from "@/features/article/ui/article-form";
import type { ArticleInsertSchema } from "@/features/write-article/model/types";
import { PageContainer } from "@/shared/components/page-container";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { useWritePage } from "@/views/write/model/use-write-page";
import { WritePageHeader } from "@/widgets/header/write-page-header/ui/write-page-header";

export const WritePageView = () => {
  const { userName, avatarUrl, openModal, email, form } = useWritePage();

  const onSubmit = (data: ArticleInsertSchema) => {
    openModal("submit-article", data);
  };

  const emotionLevel = form.watch("emotionLevel");

  return (
    <PageContainer title="게시글 작성" description="오늘은 어떤 일이 있었나요?">
      <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
        <WritePageHeader
          control={form.control}
          onSubmit={form.handleSubmit(onSubmit)}
          isValid={form.formState.isValid || true}
        />
        <Card>
          <CardHeader>
            <ArticleHeader>
              <ArticleHeaderAvatar userName={userName} avatarUrl={avatarUrl} />
              <ArticleHeaderUserInfo
                userName={userName}
                email={email}
                createdAt={new Date()}
              />
              <ArticleHeaderEmotionGauge emotionLevel={emotionLevel} />
            </ArticleHeader>
          </CardHeader>
          <CardContent>
            <ArticleForm control={form.control} />
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
};

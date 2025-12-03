"use client";

import {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderEmotionGauge,
  ArticleHeaderUserInfo,
} from "@/entities/article/ui/article-header";
import { ArticleForm } from "@/features/article/ui/article-form";
import type { ArticleFormData } from "@/features/write-article/model/types";
import { PageContainer } from "@/shared/components/page-container";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Form } from "@/shared/components/ui/form";
import { useWritePage } from "@/views/write/model/use-write-page";
import { WritePageHeader } from "@/widgets/header/write-page-header/ui/write-page-header";

export const WritePageView = () => {
  const { userName, avatarUrl, openModal, email, currentUserId, form } =
    useWritePage();

  const onSubmit = (data: ArticleFormData) => {
    openModal("submit-article", {
      ...data,
      authorId: currentUserId,
    });
  };

  const emotionLevel = form.watch("emotionLevel");

  return (
    <PageContainer title="게시글 작성" description="오늘은 어떤 일이 있었나요?">
      <Form {...form}>
        <form className="contents">
          <WritePageHeader
            control={form.control}
            onSubmit={form.handleSubmit(onSubmit)}
            isValid={form.formState.isValid}
          />
          <Card>
            <CardHeader>
              <ArticleHeader>
                <ArticleHeaderAvatar
                  userName={userName}
                  avatarUrl={avatarUrl}
                />
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
      </Form>
    </PageContainer>
  );
};

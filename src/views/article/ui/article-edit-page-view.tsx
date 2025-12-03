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
import { Separator } from "@/shared/components/ui/separator";
import { useArticleEditPage } from "@/views/article/model/use-article-edit-page";
import { WritePageHeader } from "@/widgets/header/write-page-header/ui/write-page-header";

type ArticleEditPageViewProps = {
  id: number;
  userId: string | null;
};

export const ArticleEditPageView = ({
  id,
  userId,
}: ArticleEditPageViewProps) => {
  const { userName, email, avatarUrl, openModal, form } = useArticleEditPage(
    id,
    userId,
  );

  const onSubmit = (data: ArticleInsertSchema) => {
    openModal("update-article", {
      id,
      ...data,
    });
  };

  const emotionLevel = form.watch("emotionLevel");

  return (
    <PageContainer title="게시글 수정" description="게시글을 수정합니다">
      <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
        <WritePageHeader
          control={form.control}
          onSubmit={form.handleSubmit(onSubmit)}
          isValid={form.formState.isValid}
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
          <Separator />
          <CardContent>
            <ArticleForm control={form.control} />
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
};

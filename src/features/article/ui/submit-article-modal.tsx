"use client";

import type { FormEvent } from "react";
import { useSubmitArticle } from "@/features/article/lib/use-submit-article";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";
import type { SubmitArticleDialogProps } from "@/shared/model/types";
import { useModal } from "@/shared/store/use-modal";

export const SubmitArticleModal = () => {
  const { currentModal, props } = useModal();
  const { content, userId, emotionLevel, accessType } =
    props as SubmitArticleDialogProps;
  const { mutate: onSubmit, isPending } = useSubmitArticle();

  if (currentModal !== "submit-article") return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    onSubmit({ userId, content, emotionLevel, accessType });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>작성 완료</DialogTitle>
        <DialogDescription>정말 게시하시겠습니까?</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "작성하기"}
        </Button>
      </form>
    </DialogContent>
  );
};

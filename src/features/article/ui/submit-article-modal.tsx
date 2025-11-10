"use client";

import type { FormEvent } from "react";
import type { SubmitArticleDialogProps } from "@/app/_store/modal-store";
import { useModal } from "@/app/_store/modal-store";
import { useSubmitArticle } from "@/features/article/lib/use-submit-article";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";

export const SubmitArticleModal = () => {
  const { props, closeModal } = useModal();
  const { mutate: onSubmit, isPending } = useSubmitArticle();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitProps = props as SubmitArticleDialogProps;
    if (!submitProps?.userId) return;
    onSubmit(
      {
        userId: submitProps.userId,
        title: submitProps.title,
        content: submitProps.content,
        emotionLevel: submitProps.emotionLevel,
        accessType: submitProps.accessType,
      },
      {
        onSuccess: () => closeModal(),
      },
    );
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

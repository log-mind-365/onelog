"use client";

import type { FormEvent } from "react";
import type { UpdateArticleDialogProps } from "@/app/_store/modal-store";
import { useModal } from "@/app/_store/modal-store";
import { useUpdateArticle } from "@/features/article/lib/use-update-article";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";

export const UpdateArticleModal = () => {
  const { props, closeModal } = useModal();
  const { mutate: onUpdate, isPending } = useUpdateArticle();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updateProps = props as UpdateArticleDialogProps;
    if (!updateProps?.id) return;
    onUpdate(
      {
        id: updateProps.id,
        title: updateProps.title,
        content: updateProps.content,
        emotionLevel: updateProps.emotionLevel,
        accessType: updateProps.accessType,
      },
      {
        onSuccess: () => closeModal(),
      },
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>수정 완료</DialogTitle>
        <DialogDescription>게시물을 수정하시겠습니까?</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "수정하기"}
        </Button>
      </form>
    </DialogContent>
  );
};

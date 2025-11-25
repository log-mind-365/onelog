"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useSubmitArticle } from "@/features/write-article/lib/use-submit-article";
import { useDraft } from "@/features/write-article/model/use-draft";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";
import { ROUTES } from "@/shared/model/routes";
import type { SubmitArticleDialogProps } from "@/shared/store/modal-store";
import { useModal } from "@/shared/store/modal-store";

export const SubmitArticleModal = () => {
  const { props, closeModal } = useModal();
  const { mutate: onSubmit, isPending } = useSubmitArticle();
  const { reset } = useDraft();
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitProps = props as SubmitArticleDialogProps;
    if (!submitProps?.authorId) return;
    onSubmit(
      {
        userId: submitProps.authorId,
        title: submitProps.title,
        content: submitProps.content,
        emotionLevel: submitProps.emotionLevel,
        accessType: submitProps.accessType,
      },
      {
        onSuccess: () => {
          closeModal();
          reset();
          router.replace(ROUTES.HOME);
        },
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

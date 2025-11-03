"use client";

import type { FormEvent, PropsWithChildren } from "react";
import type {
  AccessType,
  EmotionLevel,
} from "@/entities/article/article.model";
import { useSubmitArticle } from "@/features/submit-article/submit-article.model";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";

type SubmitArticleDialogProps = PropsWithChildren & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  userId?: string;
  content: string;
  emotionLevel: EmotionLevel;
  accessType: AccessType;
};

export const SubmitArticleDialog = ({
  open,
  onOpenChange,
  children,
  userId,
  content,
  emotionLevel,
  accessType,
}: SubmitArticleDialogProps) => {
  const { mutate: onSubmit, isPending } = useSubmitArticle();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    onSubmit({ userId, content, emotionLevel, accessType });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
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
    </Dialog>
  );
};

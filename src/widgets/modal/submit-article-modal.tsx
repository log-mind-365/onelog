"use client";

import { useRouter } from "next/navigation";
import { useDraft } from "@/features/write-article/lib/use-draft";
import { useSubmitArticle } from "@/features/write-article/lib/use-submit-article";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";
import { ROUTES } from "@/shared/model/routes";
import {
  type SubmitArticleDialogProps,
  useModal,
} from "@/shared/store/modal-store";

export const SubmitArticleModal = () => {
  const { props, closeModal } = useModal();
  const { mutate: onSubmit, isPending } = useSubmitArticle();
  const { reset } = useDraft();
  const router = useRouter();

  const submitArticle = () => {
    if (!props) return;
    const { authorId, ...rest } = props as SubmitArticleDialogProps;

    const data = {
      ...rest,
      userId: authorId,
    };

    onSubmit(data as any, {
      onSuccess: () => {
        closeModal();
        reset();
        router.replace(ROUTES.HOME);
      },
    });
  };


  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>작성 완료</DialogTitle>
        <DialogDescription>정말 게시하시겠습니까?</DialogDescription>
      </DialogHeader>
      <div className="w-full space-y-4">
        <Button onClick={submitArticle} disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "작성하기"}
        </Button>
      </div>
    </DialogContent>
  );
};

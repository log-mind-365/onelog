import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postArticle } from "@/entities/article/api/server";
import {
  ARTICLE_QUERY_KEY,
  ARTICLE_TOAST_MESSAGE,
} from "@/entities/article/model/constants";
import type { ArticleInsertSchema } from "@/entities/article/model/types";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";

export const useSubmitArticle = () => {
  const queryClient = getQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      content,
      emotionLevel,
      accessType,
      userId,
    }: ArticleInsertSchema): Promise<void> => {
      await postArticle({ userId, content, emotionLevel, accessType });
    },
    onSuccess: () => {
      toast.success(ARTICLE_TOAST_MESSAGE.POST.SUCCESS);
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      console.error(error);
      toast.error(ARTICLE_TOAST_MESSAGE.POST.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.PUBLIC,
      });
    },
  });
};

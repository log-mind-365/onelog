import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postArticle } from "@/entities/article/api/server";
import {
  ARTICLE_QUERY_KEY,
  ARTICLE_TOAST_MESSAGE,
} from "@/entities/article/model/constants";
import type { ArticleInsertSchema } from "@/entities/article/model/types";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";

export const useSubmitArticle = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async (params: ArticleInsertSchema): Promise<void> => {
      await postArticle(params);
    },
    onSuccess: () => {
      toast.success(ARTICLE_TOAST_MESSAGE.POST.SUCCESS);
    },
    onError: (error) => {
      console.error(error);
      toast.error(ARTICLE_TOAST_MESSAGE.POST.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.PUBLIC(null),
      });
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postArticle } from "@/entities/article/article.api";
import type { ArticleInsertSchema } from "@/entities/article/article.model";
import { getQueryClient } from "@/shared/lib/get-query-client";
import { QUERY_KEY, TOAST_MESSAGE } from "@/shared/model/constants";
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
      toast.success(TOAST_MESSAGE.ARTICLE.POST.SUCCESS);
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      console.error(error);
      toast.error(TOAST_MESSAGE.ARTICLE.POST.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ARTICLE.PUBLIC,
      });
    },
  });
};

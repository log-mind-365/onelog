import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateArticle } from "@/entities/article/api/server";
import {
  ARTICLE_QUERY_KEY,
  ARTICLE_TOAST_MESSAGE,
} from "@/entities/article/model/constants";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";
import { ROUTES } from "@/shared/model/routes";

type UpdateArticleParams = {
  id: number;
  title: string;
  content: string;
  emotionLevel: number;
  accessType: "public" | "private";
};

export const useUpdateArticle = () => {
  const queryClient = getQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      emotionLevel,
      accessType,
    }: UpdateArticleParams): Promise<void> => {
      await updateArticle(id, { title, content, emotionLevel, accessType });
    },
    onSuccess: (_, variables) => {
      toast.success(ARTICLE_TOAST_MESSAGE.UPDATE.SUCCESS);
      router.push(ROUTES.ARTICLE.VIEW(variables.id));
    },
    onError: (error) => {
      console.error(error);
      toast.error(ARTICLE_TOAST_MESSAGE.UPDATE.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: (_, __, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.PUBLIC(null),
      });
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.DETAIL(variables.id, null),
      });
    },
  });
};

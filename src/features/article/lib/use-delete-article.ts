import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteArticle } from "@/entities/article/api/server";
import { ARTICLE_QUERY_KEY } from "@/entities/article/model/constants";
import { ROUTES } from "@/shared/model/routes";

type UseDeleteArticleParams = {
  articleId: string;
};

export const useDeleteArticle = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId }: UseDeleteArticleParams): Promise<void> => {
      await deleteArticle(articleId);
    },
    onSuccess: () => {
      toast.success("게시글이 삭제되었습니다.");

      // 게시글 목록 쿼리 무효화
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.PUBLIC,
      });

      // 홈으로 리다이렉트
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      console.error(error);
      toast.error("게시글 삭제 중 오류가 발생했습니다.", {
        description: error.message,
      });
    },
  });
};

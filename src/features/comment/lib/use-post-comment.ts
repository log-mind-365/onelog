import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { COMMENT_TOAST_MESSAGE } from "@/entities/article/model/constants";
import { postComment } from "@/entities/comment/api/server";
import { COMMENT_QUERY_KEY } from "@/entities/comment/model/constants";
import type { CommentInsertSchema } from "@/entities/comment/model/types";

export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CommentInsertSchema) => {
      return postComment(data);
    },
    onSuccess: (data) => {
      toast.success(COMMENT_TOAST_MESSAGE.POST.SUCCESS);

      // 댓글 목록 갱신
      void queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEY.LIST(data.articleId),
      });

      // 댓글 개수 갱신
      void queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEY.COUNT(data.articleId),
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error(COMMENT_TOAST_MESSAGE.POST.EXCEPTION, {
        description: error.message,
      });
    },
  });
};

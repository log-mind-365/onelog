import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteComment } from "@/entities/comment/api/server";
import { COMMENT_QUERY_KEY } from "@/entities/comment/model/constants";
import { COMMENT_TOAST_MESSAGE } from "@/entities/article/model/constants";

type DeleteCommentParams = {
  commentId: string;
  articleId: string;
  userId: string;
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, userId }: DeleteCommentParams) => {
      return deleteComment(commentId, userId);
    },
    onSuccess: (data, variables) => {
      toast.success(COMMENT_TOAST_MESSAGE.DELETE.SUCCESS);

      // 댓글 목록 갱신
      void queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEY.LIST(variables.articleId),
      });

      // 댓글 개수 갱신
      void queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEY.COUNT(variables.articleId),
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error(COMMENT_TOAST_MESSAGE.DELETE.EXCEPTION, {
        description: error.message,
      });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateComment } from "@/entities/comment/api/server";
import { COMMENT_QUERY_KEY } from "@/entities/comment/model/constants";
import { COMMENT_TOAST_MESSAGE } from "@/entities/article/model/constants";

type UpdateCommentParams = {
  commentId: string;
  articleId: string;
  content: string;
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, content }: UpdateCommentParams) => {
      return updateComment(commentId, content);
    },
    onSuccess: (data, variables) => {
      toast.success(COMMENT_TOAST_MESSAGE.UPDATE.SUCCESS);

      // 댓글 목록 갱신
      void queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEY.LIST(variables.articleId),
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error(COMMENT_TOAST_MESSAGE.UPDATE.EXCEPTION, {
        description: error.message,
      });
    },
  });
};

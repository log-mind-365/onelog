import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleArticleLike } from "@/entities/article/api/server";
import type { ArticleWithAuthorInfo } from "@/entities/article/model/types";
import { QUERY_KEY, TOAST_MESSAGE } from "@/shared/model/constants";

type UseLikeArticleParams = {
  articleId: string;
  userId: string;
};

export const useLikeArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      userId,
    }: UseLikeArticleParams): Promise<{
      isLiked: boolean;
      likeCount: number;
    }> => {
      return toggleArticleLike(articleId, userId);
    },
    onMutate: async ({ articleId, userId }) => {
      // 진행 중인 쿼리들을 취소
      await queryClient.cancelQueries({
        queryKey: QUERY_KEY.ARTICLE.PUBLIC,
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEY.ARTICLE.DETAIL(articleId),
      });

      // 이전 데이터를 스냅샷으로 저장
      const previousInfiniteData = queryClient.getQueryData(
        QUERY_KEY.ARTICLE.PUBLIC,
      );
      const previousDetailData = queryClient.getQueryData(
        QUERY_KEY.ARTICLE.DETAIL(articleId),
      );

      // Optimistic Update - 무한 스크롤 목록
      queryClient.setQueryData<{
        pages: Array<{ data: ArticleWithAuthorInfo[] }>;
        pageParams: unknown[];
      }>(QUERY_KEY.ARTICLE.PUBLIC, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((article) =>
              article.id === articleId
                ? {
                    ...article,
                    isLiked: !article.isLiked,
                    likeCount: article.isLiked
                      ? article.likeCount - 1
                      : article.likeCount + 1,
                  }
                : article,
            ),
          })),
        };
      });

      // Optimistic Update - 상세 페이지
      queryClient.setQueryData<ArticleWithAuthorInfo>(
        QUERY_KEY.ARTICLE.DETAIL(articleId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            isLiked: !old.isLiked,
            likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
          };
        },
      );

      return { previousInfiniteData, previousDetailData };
    },
    onSuccess: (data) => {
      toast.success(
        data.isLiked
          ? TOAST_MESSAGE.ARTICLE.LIKE.SUCCESS
          : TOAST_MESSAGE.ARTICLE.LIKE.CANCEL,
      );
    },
    onError: (error, variables, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousInfiniteData) {
        queryClient.setQueryData(
          QUERY_KEY.ARTICLE.PUBLIC,
          context.previousInfiniteData,
        );
      }
      if (context?.previousDetailData) {
        queryClient.setQueryData(
          QUERY_KEY.ARTICLE.DETAIL(variables.articleId),
          context.previousDetailData,
        );
      }

      console.error(error);
      toast.error(TOAST_MESSAGE.ARTICLE.LIKE.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: (data, error, variables) => {
      // 쿼리 무효화하여 최신 데이터 가져오기
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ARTICLE.PUBLIC,
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ARTICLE.DETAIL(variables.articleId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ARTICLE.CHECK_LIKED(
          Number(variables.articleId),
          variables.userId,
        ),
      });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleArticleLike } from "@/entities/article/api/server";
import {
  ARTICLE_QUERY_KEY,
  ARTICLE_TOAST_MESSAGE,
} from "@/entities/article/model/constants";
import type { ArticleWithAuthorInfo } from "@/entities/article/model/types";

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
        queryKey: ARTICLE_QUERY_KEY.PUBLIC,
      });
      await queryClient.cancelQueries({
        queryKey: ARTICLE_QUERY_KEY.DETAIL(articleId, userId),
      });

      /**
       * 이전 데이터를 스냅샷으로 저장
       * 필요한 이유 :
       * - 서버 요청이 실패했을 때 원래 상태로 복구
       * - onError에서 이 데이터를 사용해 롤백
       */
      const previousInfiniteData = queryClient.getQueryData(
        ARTICLE_QUERY_KEY.PUBLIC,
      );
      const previousDetailData = queryClient.getQueryData(
        ARTICLE_QUERY_KEY.DETAIL(articleId, userId),
      );

      // Optimistic Update - 무한 스크롤 목록
      queryClient.setQueryData<{
        pages: Array<{ data: ArticleWithAuthorInfo[] }>;
        pageParams: unknown[];
      }>(ARTICLE_QUERY_KEY.PUBLIC, (old) => {
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
        ARTICLE_QUERY_KEY.DETAIL(articleId, userId),
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
          ? ARTICLE_TOAST_MESSAGE.LIKE.SUCCESS
          : ARTICLE_TOAST_MESSAGE.LIKE.CANCEL,
      );
    },
    onError: (error, variables, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousInfiniteData) {
        queryClient.setQueryData(
          ARTICLE_QUERY_KEY.PUBLIC,
          context.previousInfiniteData,
        );
      }
      if (context?.previousDetailData) {
        queryClient.setQueryData(
          ARTICLE_QUERY_KEY.DETAIL(variables.articleId, variables.userId),
          context.previousDetailData,
        );
      }

      console.error(error);
      toast.error(ARTICLE_TOAST_MESSAGE.LIKE.EXCEPTION, {
        description: error.message,
      });
    },
    onSettled: (data, error, variables) => {
      // 쿼리 무효화하여 최신 데이터 가져오기
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.PUBLIC,
      });
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.DETAIL(
          variables.articleId,
          variables.userId,
        ),
      });
      void queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEY.CHECK_LIKED(
          Number(variables.articleId),
          variables.userId,
        ),
      });
    },
  });
};

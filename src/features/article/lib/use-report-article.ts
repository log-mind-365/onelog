import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportArticle } from "@/entities/article/api/server";

type UseReportArticleParams = {
  articleId: number;
  reporterId: string;
  reportType: "spam" | "inappropriate" | "harassment" | "other";
  reason?: string;
};

export const useReportArticle = () => {
  return useMutation({
    mutationFn: async (params: UseReportArticleParams): Promise<void> => {
      return reportArticle(params);
    },
    onSuccess: () => {
      toast.success("신고가 접수되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("신고 처리 중 오류가 발생했습니다.", {
        description: error.message,
      });
    },
  });
};

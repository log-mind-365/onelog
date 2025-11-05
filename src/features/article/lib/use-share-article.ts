import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getQueryClient } from "@/shared/lib/tanstack/get-query-client";

export const useShareArticle = () => {
  const queryClient = getQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {},
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {},
  });
};

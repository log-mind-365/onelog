import { queryOptions } from "@tanstack/react-query";
import { getUserInfo } from "@/entities/user/user.api";
import { QUERY_KEY } from "@/shared/model/constants";

export const userQueries = {
  getUserInfo: (id: string) =>
    queryOptions({
      queryKey: QUERY_KEY.USER.INFO(id),
      queryFn: async () => getUserInfo(id),
    }),
};

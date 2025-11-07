import { queryOptions } from "@tanstack/react-query";
import { getUserInfo } from "@/entities/user/api/server";
import { USER_QUERY_KEY } from "@/entities/user/model/constants";

export const userQueries = {
  getUserInfo: (id: string) =>
    queryOptions({
      queryKey: USER_QUERY_KEY.INFO(id),
      queryFn: async () => getUserInfo(id),
    }),
};

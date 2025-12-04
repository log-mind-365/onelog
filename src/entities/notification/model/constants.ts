import type { NotificationType } from "@/entities/notification/model/types";

export const NOTIFICATION_QUERY_KEY = {
  LIST: (userId: string, type: NotificationType) => [
    "notification",
    "list",
    userId,
    type,
  ],
};

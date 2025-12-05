import type { notifications } from "@/db/schemas/notifications";

export type NotificationType = typeof notifications.$inferSelect.type;
export type NotificationRow = typeof notifications.$inferSelect;

export type ArticleLikeMetadata = {
  articleId: number;
  articleTitle: string;
  senderNickname: string;
};

export type ArticleCommentMetadata = {
  articleId: number;
  articleTitle: string;
  commentId: number;
  commentContent: string;
  senderNickname: string;
};

export type UserFollowMetadata = {
  senderNickname: string;
  senderAvatarUrl: string;
};

export type SystemMetadata = {
  message: string;
  priority: number;
};

export type NotificationMetadata =
  | {
      type: "like";
      metadata: ArticleLikeMetadata;
    }
  | {
      type: "comment";
      metadata: ArticleCommentMetadata;
    }
  | {
      type: "follow";
      metadata: UserFollowMetadata;
    }
  | {
      type: "system";
      metadata: SystemMetadata;
    };

export type Notification = Omit<NotificationRow, "metadata" | "type"> &
  NotificationMetadata;

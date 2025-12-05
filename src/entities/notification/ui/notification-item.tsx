import type { Notification } from "@/entities/notification/model/types";
import { CommentNotification } from "@/entities/notification/ui/comment-notification";
import { FollowNotification } from "@/entities/notification/ui/follow-notification";
import { LikeNotification } from "@/entities/notification/ui/like-notification";
import { SystemNotification } from "@/entities/notification/ui/system-notification";

type NotificationItemProps = {
  notification: Notification;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  switch (notification.type) {
    case "like":
      return (
        <LikeNotification
          metadata={notification.metadata}
          createdAt={notification.createdAt}
        />
      );
    case "comment":
      return (
        <CommentNotification
          metadata={notification.metadata}
          createdAt={notification.createdAt}
        />
      );
    case "follow":
      return (
        <FollowNotification
          metadata={notification.metadata}
          senderId={notification?.senderId ?? ""}
          createdAt={notification.createdAt}
        />
      );
    case "system":
      return (
        <SystemNotification
          metadata={notification.metadata}
          createdAt={notification.createdAt}
        />
      );
  }
};

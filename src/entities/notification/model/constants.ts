import {
  CircleAlertIcon,
  HeartIcon,
  MessageCircleWarningIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { NotificationType } from "@/entities/notification/model/types";

export const NOTIFICATION_QUERY_KEY = {
  LIST: (userId: string, type: NotificationType) => [
    "notification",
    "list",
    userId,
    type,
  ],
};

export const NOTIFICATION_TYPE_MAP = {
  like: {
    label: "좋아요 알림",
    message: (senderNickname: string) =>
      `${senderNickname}님이 회원님의 글을 좋아합니다.`,
    icon: HeartIcon,
  },
  comment: {
    label: "댓글 알림",
    message: (senderNickname: string) =>
      `${senderNickname}님이 회원님의 글에 댓글을 남겼습니다.`,
    icon: MessageCircleWarningIcon,
  },
  follow: {
    label: "팔로우 알림",
    message: (senderNickname: string) =>
      `${senderNickname}님이 회원님을 팔로우하기 시작했습니다.`,
    icon: HeartIcon,
  },
  system: {
    label: "시스템 알림",
    message: (message: string) => `${message}`,
    icon: (priority: number) => {
      switch (priority) {
        case 1:
          return CircleAlertIcon;
        case 2:
          return TriangleAlertIcon;
        case 3:
          return OctagonAlertIcon;
        default:
          return CircleAlertIcon;
      }
    },
  },
} as const;

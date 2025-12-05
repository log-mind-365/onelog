import { PopoverClose } from "@radix-ui/react-popover";
import { InboxIcon, XIcon } from "lucide-react";
import type { Notification } from "@/entities/notification/model/types";
import { MessageItem } from "@/entities/notification/ui/message-item";
import { NotificationItem } from "@/entities/notification/ui/notification-item";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/helpers/client-helper";

const NOTIFICATION_ITEMS: Notification[] = [
  {
    id: 1,
    receiverId: "1234-1234",
    senderId: "asdf-1234",
    type: "like",
    metadata: {
      articleId: 12,
      articleTitle: "어쩌라고",
      senderNickname: "홍길동",
    },
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: 2,
    receiverId: "1234-1234",
    senderId: "asdf-1234",
    type: "comment",
    metadata: {
      senderNickname: "홍길동",
      articleTitle: "나는 그냥...",
      articleId: 12,
      commentContent: "잘 생각하셨어요.",
      commentId: 22,
    },
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: 3,
    receiverId: "1234-1234",
    senderId: "asdf-1234",
    type: "comment",
    metadata: {
      senderNickname: "홍길동",
      articleTitle: "나는 그냥...",
      articleId: 12,
      commentContent: "그런데 있잖아요.",
      commentId: 23,
    },
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: 4,
    receiverId: "1234-1234",
    senderId: "asdf-1234",
    type: "follow",
    metadata: {
      senderNickname: "홍길동",
      senderAvatarUrl:
        "https://hqnnxblmnwequzzhbwas.supabase.co/storage/v1/object/public/avatars/724ed4ff-5a02-475d-af11-1c2b8ce8b3aa/avatar-1764731664764.jpg",
    },
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: 5,
    receiverId: "1234-1234",
    senderId: null,
    type: "system",
    metadata: {
      message: "시스템 메시지입니다.",
      priority: 3,
    },
    isRead: false,
    createdAt: new Date(),
  },
];

export const NotificationButton = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon-lg"
          className={cn("rounded-full shadow-md", className)}
          {...props}
        >
          <InboxIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" align="end">
        <Tabs defaultValue="notification">
          <div className="flex justify-between">
            <TabsList className="bg-transparent">
              <TabsTrigger value="notification" className="!shadow-none">
                알림
              </TabsTrigger>
              <TabsTrigger value="message" className="!shadow-none">
                메시지
              </TabsTrigger>
            </TabsList>
            <PopoverClose asChild>
              <Button size="icon" variant="ghost">
                <XIcon />
              </Button>
            </PopoverClose>
          </div>

          {/* 알림 탭 내용 */}
          <TabsContent value="notification" className="flex flex-col gap-2">
            {NOTIFICATION_ITEMS.map((item) => (
              <NotificationItem key={item.id} notification={item} />
            ))}
          </TabsContent>

          {/* 메시지 탭 내용 */}
          <TabsContent value="message">
            <MessageItem />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

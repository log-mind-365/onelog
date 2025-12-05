import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { NOTIFICATION_TYPE_MAP } from "@/entities/notification/model/constants";
import type { UserFollowMetadata } from "@/entities/notification/model/types";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";
import { ROUTES } from "@/shared/model/routes";

interface FollowNotificationProps {
  metadata: UserFollowMetadata;
  senderId: string;
  createdAt: Date;
}
export const FollowNotification = ({
  metadata,
  senderId,
  createdAt,
}: FollowNotificationProps) => {
  return (
    <Item variant="outline" asChild>
      <Link href={ROUTES.PROFILE.VIEW(senderId)}>
        <ItemMedia variant="image">
          <UserAvatar
            fallback={metadata.senderNickname}
            avatarUrl={metadata.senderAvatarUrl}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="w-full">
            {NOTIFICATION_TYPE_MAP.follow.label}
          </ItemTitle>
          <ItemDescription>
            {NOTIFICATION_TYPE_MAP.follow.message(metadata.senderNickname)}
          </ItemDescription>
          <ItemFooter className="justify-end text-muted-foreground text-xs">
            {formatDistanceToNow(createdAt, {
              addSuffix: true,
              locale: ko,
            })}
          </ItemFooter>
        </ItemContent>
      </Link>
    </Item>
  );
};

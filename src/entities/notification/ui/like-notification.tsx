import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { NOTIFICATION_TYPE_MAP } from "@/entities/notification/model/constants";
import type { ArticleLikeMetadata } from "@/entities/notification/model/types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";
import { ROUTES } from "@/shared/model/routes";

interface LikeNotificationProps {
  metadata: ArticleLikeMetadata;
  createdAt: Date;
}

export const LikeNotification = ({
  metadata,
  createdAt,
}: LikeNotificationProps) => {
  return (
    <Item variant="outline" asChild>
      <Link href={ROUTES.ARTICLE.VIEW(metadata.articleId)}>
        <ItemMedia variant="icon">
          <NOTIFICATION_TYPE_MAP.like.icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{NOTIFICATION_TYPE_MAP.like.label}</ItemTitle>
          <ItemDescription>
            {NOTIFICATION_TYPE_MAP.like.message(metadata.senderNickname)}
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

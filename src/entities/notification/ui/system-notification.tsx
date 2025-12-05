import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { NOTIFICATION_TYPE_MAP } from "@/entities/notification/model/constants";
import type { SystemMetadata } from "@/entities/notification/model/types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";

interface SystemNotificationProps {
  metadata: SystemMetadata;
  createdAt: Date;
}

export const SystemNotification = ({
  metadata,
  createdAt,
}: SystemNotificationProps) => {
  const Icon = NOTIFICATION_TYPE_MAP.system.icon(metadata.priority);
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Icon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="w-full">
          {NOTIFICATION_TYPE_MAP.system.label}
        </ItemTitle>
        <ItemDescription>
          {NOTIFICATION_TYPE_MAP.system.message(metadata.message)}
        </ItemDescription>
        <ItemFooter className="justify-end text-muted-foreground text-xs">
          {formatDistanceToNow(createdAt, {
            addSuffix: true,
            locale: ko,
          })}
        </ItemFooter>
      </ItemContent>
    </Item>
  );
};

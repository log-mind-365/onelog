import { ShieldAlertIcon } from "lucide-react";
import type { Notification } from "@/entities/notification/model/types";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";

type NotificationItemProps = {
  item: Notification;
};

export const NotificationItem = ({ item }: NotificationItemProps) => {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <ShieldAlertIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item.receiverId}</ItemTitle>
      </ItemContent>
    </Item>
  );
};

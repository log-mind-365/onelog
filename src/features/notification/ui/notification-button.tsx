"use client";

import { InboxIcon, XIcon } from "lucide-react";
import { MessageItem } from "@/entities/notification/ui/message-item";
import { NotificationItem } from "@/entities/notification/ui/notification-item";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/helpers/client-helper";

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
          className={cn(className, "rounded-full backdrop-blur-lg")}
          {...props}
        >
          <InboxIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
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
            <Button size="icon" variant="ghost">
              <XIcon />
            </Button>
          </div>
          <Separator orientation="horizontal" />
          <TabsContent value="notification">
            <NotificationItem />
          </TabsContent>
          <TabsContent value="message">
            <MessageItem />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

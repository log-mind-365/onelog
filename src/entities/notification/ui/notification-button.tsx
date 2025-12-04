import { InboxIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/helpers/client-helper";

export const NotificationButton = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <Button
      variant="default"
      size="icon-lg"
      className={cn(className, "rounded-full backdrop-blur-lg")}
      {...props}
    >
      <InboxIcon />
    </Button>
  );
};

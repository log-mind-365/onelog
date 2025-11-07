import { MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface Props {
  commentCount?: number;
  onClick?: () => void;
  orientation?: "horizontal" | "vertical";
  isSide?: boolean;
}

export const ArticleCommentButton = ({
  isSide,
  onClick,
  orientation = "horizontal",
  commentCount = 0,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          onClick={onClick}
          className={cn(
            "flex gap-1 text-xs transition-colors hover:text-blue-400",
            orientation === "horizontal" && "flex-row",
            isSide && "max-lg:flex-col",
          )}
        >
          <MessageCircle />
          {commentCount ?? 0}
        </Button>
      </TooltipTrigger>
      <TooltipContent>댓글</TooltipContent>
    </Tooltip>
  );
};

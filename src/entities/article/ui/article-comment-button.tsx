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
  isSide?: boolean;
}

export const ArticleCommentButton = ({
  isSide,
  onClick,
  commentCount = 0,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size={isSide ? "default" : "sm"}
          onClick={onClick}
          className={cn(
            "gap-1 font-light text-xs transition-colors hover:text-blue-400",
            isSide && "max-lg:flex-col",
          )}
        >
          <MessageCircle className="size-4" />
          {commentCount ?? 0}
        </Button>
      </TooltipTrigger>
      <TooltipContent>댓글</TooltipContent>
    </Tooltip>
  );
};

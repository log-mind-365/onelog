import { Flag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface Props {
  onClick: () => void;
}

export function ArticleReportButton({ onClick }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label="신고"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="gap-2 font-light text-xs transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/25 dark:hover:text-red-600"
        >
          <Flag className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>신고</TooltipContent>
    </Tooltip>
  );
}

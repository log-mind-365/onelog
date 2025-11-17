import { Link, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface Props {
  onClick: () => Promise<void>;
}

export function ShareArticleButton({ onClick }: Props) {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto p-2 hover:text-green-400 dark:hover:text-green-400"
            >
              <Share2 className="h-4 w-4 md:h-6 md:w-6" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              void onClick();
            }}
            className="cursor-pointer gap-2"
          >
            <Link className="h-4 w-4" />
            URL 복사
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>공유</TooltipContent>
    </Tooltip>
  );
}

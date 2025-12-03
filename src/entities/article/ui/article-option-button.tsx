import { Edit2, MoreVertical, Trash2 } from "lucide-react";
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

type ArticleOptionsDropdownMenuProps = {
  onModify: () => void;
  onDelete: () => void;
};

export const ArticleOptionsDropdownMenu = ({
  onModify,
  onDelete,
}: ArticleOptionsDropdownMenuProps) => {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="게시물 옵션"
              variant="ghost"
              className="h-auto p-2"
            >
              <MoreVertical className="h-4 w-4 md:h-6 md:w-6" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onModify();
            }}
            className="cursor-pointer gap-2"
          >
            <Edit2 className="h-4 w-4" />
            수정하기
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="cursor-pointer gap-2"
          >
            <Trash2 className="h-4 w-4" />
            삭제하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>옵션</TooltipContent>
    </Tooltip>
  );
};

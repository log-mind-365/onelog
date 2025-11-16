import type { PopoverContentProps } from "@radix-ui/react-popover";
import { Globe, Lock } from "lucide-react";
import type { AccessType } from "@/entities/article/model/types";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

type AccessTypeButtonProps = {
  value?: AccessType;
  onValueChange?: (value: string) => void;
  dropdownMenuSide?: PopoverContentProps["side"];
  dropdownMenuAlign?: PopoverContentProps["align"];
  readOnly?: boolean;
};

export const ArticleAccessTypeButton = ({
  value,
  onValueChange,
  dropdownMenuSide = "right",
  dropdownMenuAlign = "start",
  readOnly = false,
}: AccessTypeButtonProps) => {
  // 읽기 전용 모드: 드롭다운 없이 정적 아이콘만 표시
  if (readOnly || !onValueChange) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="게시물 공개 여부"
            variant="ghost"
            className={cn(
              "cursor-default gap-1 font-light text-xs hover:bg-transparent",
            )}
            onClick={(e) => e.preventDefault()}
          >
            {value === "public" ? (
              <Globe className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {value === "public" ? "공개 게시물" : "비공개 게시물"}
        </TooltipContent>
      </Tooltip>
    );
  }

  // 편집 가능 모드: 드롭다운으로 변경 가능
  return (
    <Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              aria-label="게시물 공개 여부"
              variant="ghost"
              className={cn(
                "gap-1 font-light text-xs transition-colors hover:text-green-400",
              )}
            >
              {value === "public" ? (
                <Globe className="size-4" />
              ) : (
                <Lock className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent side={dropdownMenuSide} align={dropdownMenuAlign}>
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
            <DropdownMenuRadioItem value="public">공개</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="private">
              비공개
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>공개 여부</TooltipContent>
    </Tooltip>
  );
};

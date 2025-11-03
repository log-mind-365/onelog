import type { PopoverContentProps } from "@radix-ui/react-popover";
import { Globe, Lock } from "lucide-react";
import type { AccessType } from "@/entities/article/article.model";
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
  tooltipSide?: PopoverContentProps["side"];
  dropdownMenuSide?: PopoverContentProps["side"];
  dropdownMenuAlign?: PopoverContentProps["align"];
};

export const ArticleAccessTypeButton = ({
  value,
  onValueChange,
  tooltipSide = "right",
  dropdownMenuSide = "right",
  dropdownMenuAlign = "start",
}: AccessTypeButtonProps) => {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
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
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent side={dropdownMenuSide} align={dropdownMenuAlign}>
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
            <DropdownMenuRadioItem value="public">공개</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="private">
              비공개
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent side={tooltipSide}>공개 여부</TooltipContent>
    </Tooltip>
  );
};

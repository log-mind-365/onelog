import type { PopoverContentProps } from "@radix-ui/react-popover";
import { SmilePlus } from "lucide-react";
import { EMOTION_STATUS } from "@/entities/article/model/constants";
import type { EmotionLevel } from "@/entities/article/model/types";
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

type ArticleEmotionButtonProps = {
  value: EmotionLevel | null;
  onValueChange?: (value: string) => void;
  tooltipSide?: PopoverContentProps["side"];
  dropdownMenuSide?: PopoverContentProps["side"];
  dropdownMenuAlign?: PopoverContentProps["align"];
};

export const ArticleEmotionButton = ({
  value,
  onValueChange,
  tooltipSide = "right",
  dropdownMenuSide = "right",
  dropdownMenuAlign = "start",
}: ArticleEmotionButtonProps) => {
  return (
    <Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="gap-1 font-light text-xs">
              <SmilePlus />
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent side={tooltipSide}>감정 농도</TooltipContent>
        <DropdownMenuContent side={dropdownMenuSide} align={dropdownMenuAlign}>
          <DropdownMenuRadioGroup
            value={value?.toString()}
            onValueChange={onValueChange}
          >
            {EMOTION_STATUS.map((emotion) => (
              <DropdownMenuRadioItem
                key={emotion.percent}
                value={emotion.percent.toString()}
              >
                {emotion.status}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
};

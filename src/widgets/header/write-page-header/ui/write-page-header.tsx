import { Check } from "lucide-react";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { ModalProps, ModalType } from "@/shared/store/modal-store";

type WritePageHeaderProps = {
  accessType: AccessType;
  onAccessTypeChange: (value: string) => void;
  emotionLevel: EmotionLevel;
  onEmotionLevelChange: (value: EmotionLevel) => void;
  openModal: (modalId: ModalType, modalProps?: ModalProps) => void;
  title: string;
  content: string;
  authorId: string;
};

export const WritePageHeader = ({
  accessType,
  onAccessTypeChange,
  emotionLevel,
  onEmotionLevelChange,
  openModal,
  title,
  content,
  authorId,
}: WritePageHeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between rounded-lg border bg-card p-2 shadow-sm">
      <TooltipProvider>
        <ArticleAccessTypeButton
          value={accessType}
          onValueChange={onAccessTypeChange}
          dropdownMenuSide="bottom"
          dropdownMenuAlign="start"
        />
        <ArticleEmotionButton
          value={emotionLevel}
          onValueChange={onEmotionLevelChange}
          tooltipSide="bottom"
          dropdownMenuSide="bottom"
          dropdownMenuAlign="start"
        />
        <div className="ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  openModal("submit-article", {
                    title,
                    content,
                    accessType,
                    emotionLevel,
                    authorId,
                  })
                }
                disabled={!title.trim() || !content.trim()}
              >
                <Check />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              완료
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </header>
  );
};

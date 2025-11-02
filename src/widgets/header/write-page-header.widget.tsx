import { ArrowLeft } from "lucide-react";
import type {
  AccessType,
  EmotionLevel,
} from "@/entities/article/article.model";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { Container } from "@/shared/components/container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type WritePageHeaderProps = {
  accessType: AccessType;
  emotionLevel: EmotionLevel | null;
  onAccessTypeChange: (value: string) => void;
  onEmotionChange: (value: string) => void;
  onBack: () => void;
};

export const WritePageHeader = ({
  accessType,
  emotionLevel,
  onAccessTypeChange,
  onEmotionChange,
  onBack,
}: WritePageHeaderProps) => {
  return (
    <TooltipProvider>
      <Container.Header>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            뒤로 가기
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" />
        <ArticleAccessTypeButton
          value={accessType}
          onValueChange={onAccessTypeChange}
          tooltipSide="bottom"
          dropdownMenuSide="bottom"
          dropdownMenuAlign="start"
        />
        <ArticleEmotionButton
          value={emotionLevel}
          onValueChange={onEmotionChange}
          tooltipSide="bottom"
          dropdownMenuSide="bottom"
          dropdownMenuAlign="start"
        />
      </Container.Header>
    </TooltipProvider>
  );
};

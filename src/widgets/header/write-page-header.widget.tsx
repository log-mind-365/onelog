import { ArrowLeft, Check } from "lucide-react";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { SubmitArticleModal } from "@/features/article/ui/submit-article-modal";
import { Container } from "@/shared/components/container";
import { Modal } from "@/shared/components/modal-container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useModal } from "@/shared/store/use-modal";

type WritePageHeaderProps = {
  accessType: AccessType;
  emotionLevel: EmotionLevel | null;
  content: string;
  userId?: string;
  onAccessTypeChange: (value: string) => void;
  onEmotionChange: (value: string) => void;
  onBack: () => void;
};

export const WritePageHeader = ({
  accessType,
  emotionLevel,
  content,
  userId,
  onAccessTypeChange,
  onEmotionChange,
  onBack,
}: WritePageHeaderProps) => {
  const { openModal } = useModal();

  return (
    <>
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
          <div className="ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => openModal("submit-article")}
                  disabled={!content.trim()}
                >
                  <Check />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                완료
              </TooltipContent>
            </Tooltip>
          </div>
        </Container.Header>
      </TooltipProvider>

      <Modal type="submit-article">
        <SubmitArticleModal
          accessType={accessType}
          emotionLevel={emotionLevel}
          userId={userId}
          content={content}
        />
      </Modal>
    </>
  );
};

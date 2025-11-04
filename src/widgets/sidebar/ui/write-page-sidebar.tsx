import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
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

type WritePageSidebarProps = {
  accessType: AccessType;
  emotionLevel: EmotionLevel;
  content: string;
  userId?: string;
  onAccessTypeChange: (value: string) => void;
  onEmotionChange: (value: string) => void;
  onBack: () => void;
};

export const WritePageSidebar = ({
  accessType,
  emotionLevel,
  content,
  userId,
  onAccessTypeChange,
  onEmotionChange,
  onBack,
}: WritePageSidebarProps) => {
  const { openModal } = useModal();
  return (
    <>
      <TooltipProvider>
        <Container.Sidebar>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">뒤로 가기</TooltipContent>
          </Tooltip>
          <Separator />
          <ArticleAccessTypeButton
            value={accessType}
            onValueChange={onAccessTypeChange}
          />
          <ArticleEmotionButton
            value={emotionLevel}
            onValueChange={onEmotionChange}
          />
          <Separator />
          <Button onClick={() => openModal("submit-article")}>
            <Check />
          </Button>
        </Container.Sidebar>
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

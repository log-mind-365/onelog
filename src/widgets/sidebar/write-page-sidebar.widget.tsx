import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import type {
  AccessType,
  EmotionLevel,
} from "@/entities/article/article.model";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { SubmitArticleDialog } from "@/features/submit-article/ui/submit-article";
import { Container } from "@/shared/components/container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

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
  const [showSubmit, setShowSubmit] = useState(false);
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
          <Button onClick={() => setShowSubmit(true)}>
            <Check />
          </Button>
        </Container.Sidebar>
      </TooltipProvider>

      <SubmitArticleDialog
        open={showSubmit}
        onOpenChange={setShowSubmit}
        accessType={accessType}
        emotionLevel={emotionLevel}
        userId={userId}
        content={content}
      />
    </>
  );
};

"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { HeaderContainer } from "@/shared/components/header-container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useAuth } from "@/shared/store/use-auth";
import { useModal } from "@/shared/store/use-modal";
import { useArticleFormStore } from "@/views/write/use-article-form-store";

export const WritePageHeader = () => {
  const router = useRouter();
  const { me } = useAuth();
  const { setAccessType, setEmotionLevel } = useArticleFormStore();
  const { openModal } = useModal();
  const content = useArticleFormStore((state) => state.content);
  const accessType = useArticleFormStore((state) => state.accessType);
  const emotionLevel = useArticleFormStore((state) => state.emotionLevel);

  return (
    <HeaderContainer>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={() => router.back()}>
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
          onValueChange={setAccessType}
          tooltipSide="bottom"
          dropdownMenuSide="bottom"
          dropdownMenuAlign="start"
        />
        <ArticleEmotionButton
          value={emotionLevel}
          onValueChange={setEmotionLevel}
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
                    content,
                    accessType,
                    emotionLevel,
                    userId: me?.id,
                  })
                }
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
      </TooltipProvider>
    </HeaderContainer>
  );
};

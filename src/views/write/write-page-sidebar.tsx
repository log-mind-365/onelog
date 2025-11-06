"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { SidebarContainer } from "@/shared/components/sidebar-container";
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

export const WritePageSidebar = () => {
  const router = useRouter();
  const { setAccessType, setEmotionLevel } = useArticleFormStore();
  const { openModal } = useModal();
  const { me } = useAuth();
  const content = useArticleFormStore((state) => state.content);
  const accessType = useArticleFormStore((state) => state.accessType);
  const emotionLevel = useArticleFormStore((state) => state.emotionLevel);

  return (
    <SidebarContainer>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">뒤로 가기</TooltipContent>
        </Tooltip>
        <Separator />
        <ArticleAccessTypeButton
          value={accessType}
          onValueChange={setAccessType}
        />
        <ArticleEmotionButton
          value={emotionLevel}
          onValueChange={setEmotionLevel}
        />
        <Separator />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                openModal("submit-article", {
                  userId: me?.id,
                  content,
                  accessType,
                  emotionLevel,
                })
              }
              className="w-full"
              disabled={!content.trim()}
            >
              <Check />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">완료</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SidebarContainer>
  );
};

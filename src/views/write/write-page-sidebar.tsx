"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/_providers/modal-store";
import type { AccessType } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { useAuth } from "@/features/auth/model/store";
import { SidebarContainer } from "@/shared/components/sidebar-container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useDraft } from "@/views/write/use-draft";

export const WritePageSidebar = () => {
  const router = useRouter();
  const { setAccessType, setEmotionLevel } = useDraft();
  const { openModal } = useModal();
  const { me } = useAuth();
  const title = useDraft((state) => state.title);
  const content = useDraft((state) => state.content);
  const accessType = useDraft((state) => state.accessType);
  const emotionLevel = useDraft((state) => state.emotionLevel);

  const handleAccessTypeChange = (value: string) => {
    setAccessType(value as AccessType);
  };
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
          onValueChange={handleAccessTypeChange}
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
                  title,
                  content,
                  accessType,
                  emotionLevel,
                })
              }
              className="w-full"
              disabled={!title.trim() || !content.trim()}
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

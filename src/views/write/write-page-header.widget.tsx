"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/_providers/modal-store";
import type { AccessType } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { useAuth } from "@/features/auth/model/store";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useDraft } from "@/views/write/use-draft";

export const WritePageHeader = () => {
  const router = useRouter();
  const { me } = useAuth();
  const { setAccessType, setEmotionLevel } = useDraft();
  const { openModal } = useModal();
  const title = useDraft((state) => state.title);
  const content = useDraft((state) => state.content);
  const accessType = useDraft((state) => state.accessType);
  const emotionLevel = useDraft((state) => state.emotionLevel);

  const handleAccessTypeChange = (value: string) => {
    setAccessType(value as AccessType);
  };
  return (
    <header className="flex w-full items-center justify-between rounded-lg border bg-card p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">뒤로 가기</TooltipContent>
        </Tooltip>
        <ArticleAccessTypeButton
          value={accessType}
          onValueChange={handleAccessTypeChange}
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
                    title,
                    content,
                    accessType,
                    emotionLevel,
                    userId: me?.id,
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

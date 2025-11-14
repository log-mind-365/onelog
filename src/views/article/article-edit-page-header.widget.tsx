"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/_store/modal-store";
import type { AccessType } from "@/entities/article/model/types";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import { useDraft } from "@/features/write-article/model/use-draft";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type ArticleEditPageHeaderProps = {
  articleId: number;
};

export const ArticleEditPageHeader = ({
  articleId,
}: ArticleEditPageHeaderProps) => {
  const router = useRouter();
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
                  openModal("update-article", {
                    id: articleId,
                    title,
                    content,
                    accessType,
                    emotionLevel,
                  })
                }
                disabled={!title.trim() || !content.trim()}
              >
                <Check />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              수정 완료
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </header>
  );
};

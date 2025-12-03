import { Check } from "lucide-react";
import type { Control } from "react-hook-form";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import type { ArticleFormData } from "@/features/write-article/model/types";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type WritePageHeaderProps = {
  control: Control<ArticleFormData>;
  onSubmit: () => void;
  isValid: boolean;
};

export const WritePageHeader = ({
  control,
  onSubmit,
  isValid,
}: WritePageHeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between rounded-lg border bg-card p-2 shadow-sm">
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <FormField
            control={control}
            name="accessType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ArticleAccessTypeButton
                    value={field.value}
                    onValueChange={field.onChange}
                    dropdownMenuSide="bottom"
                    dropdownMenuAlign="start"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="emotionLevel"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ArticleEmotionButton
                    value={field.value}
                    onValueChange={field.onChange}
                    tooltipSide="bottom"
                    dropdownMenuSide="bottom"
                    dropdownMenuAlign="start"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onSubmit} disabled={!isValid}>
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

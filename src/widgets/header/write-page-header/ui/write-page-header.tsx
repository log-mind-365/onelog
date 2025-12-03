import { Check } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import { ArticleAccessTypeButton } from "@/entities/article/ui/article-access-type-button";
import { ArticleEmotionButton } from "@/entities/article/ui/article-emotion-button";
import type { ArticleInsertSchema } from "@/features/write-article/model/types";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type WritePageHeaderProps = {
  control: Control<ArticleInsertSchema>;
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
        <div className="flex flex-row items-center justify-between gap-1">
          <Controller
            name="accessType"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <ArticleAccessTypeButton
                  value={field.value}
                  onValueChange={field.onChange}
                  dropdownMenuSide="bottom"
                  dropdownMenuAlign="start"
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="emotionLevel"
            render={({ field }) => (
              <Field>
                <ArticleEmotionButton
                  value={field.value}
                  onValueChange={field.onChange}
                  tooltipSide="bottom"
                  dropdownMenuSide="bottom"
                  dropdownMenuAlign="start"
                />
              </Field>
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

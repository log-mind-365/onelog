import { type Control, Controller } from "react-hook-form";
import type { ArticleInsertSchema } from "@/features/write-article/model/types";
import { Field, FieldError, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

type ArticleFormProps = {
  control: Control<ArticleInsertSchema>;
};

export const ArticleForm = ({ control }: ArticleFormProps) => {
  return (
    <FieldSet>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              placeholder="제목을 입력하세요"
              className="!text-lg rounded-none border-0 px-0 font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        control={control}
        name="content"
        render={({ field, fieldState }) => (
          <Field>
            <Textarea
              aria-invalid={fieldState.invalid}
              placeholder="오늘은 어떤 일이 있었나요?"
              className="max-h-40 min-h-20 resize-none rounded-none border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </FieldSet>
  );
};

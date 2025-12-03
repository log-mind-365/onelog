import type { Control } from "react-hook-form";
import type { ArticleFormData } from "@/features/write-article/model/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

type ArticleFormProps = {
  control: Control<ArticleFormData>;
};

export const ArticleForm = ({ control }: ArticleFormProps) => {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="제목을 입력하세요"
                className="!text-lg rounded-none border-0 font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="오늘은 어떤 일이 있었나요?"
                className="max-h-40 min-h-20 resize-none rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

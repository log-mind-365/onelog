import { FileExclamationPoint } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

type EmptyArticleProps = {
  title?: string;
  description?: string;
};

export const EmptyArticle = ({
  title = "아직 작성된 글이 없어요.",
  description = "일기를 작성해 보세요.",
}: EmptyArticleProps) => {
  return (
    <Empty className="border bg-card shadow-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileExclamationPoint />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

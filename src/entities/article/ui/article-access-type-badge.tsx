import type { AccessType } from "@/entities/article/model/types";
import { Badge } from "@/shared/components/ui/badge";

type ArticleAccessTypeLabelProps = {
  accessType: AccessType;
};

export const ArticleAccessTypeBadge = ({
  accessType,
}: ArticleAccessTypeLabelProps) => {
  return (
    <Badge className="h-fit items-center">
      {accessType === "public" ? "공개" : "비공개"}
    </Badge>
  );
};

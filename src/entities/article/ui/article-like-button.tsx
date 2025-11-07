import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type LikeButtonProps = {
  onClick: (e: MouseEvent) => void;
  likeCount?: number;
  orientation?: "horizontal" | "vertical";
  isLike?: boolean;
};

export const ArticleLikeButton = ({
  likeCount = 0,
  onClick,
  orientation = "horizontal",
  isLike = false,
}: LikeButtonProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex gap-1 text-xs transition-colors hover:text-red-500",
        orientation === "horizontal" && "flex-row",
        orientation === "vertical" && "flex-col",
        isLike && "text-red-500",
      )}
    >
      <Heart className={cn(isLike && "fill-red-500")} />
      {likeCount ?? 0}
    </Button>
  );
};

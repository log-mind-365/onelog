import type { ComponentProps } from "react";
import { ArticleUserInfo } from "@/entities/article/ui/article-user-info";
import EmotionGauge from "@/entities/article/ui/emotion-gauge";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { cn } from "@/shared/lib/utils";

type ArticleCardHeaderProps = ComponentProps<"div"> & {
  userName: string;
  avatarUrl: string | null;
  email: string;
  emotionLevel: number;
  createdAt?: Date;
};

export const ArticleHeader = ({
  userName,
  avatarUrl,
  email,
  emotionLevel,
  createdAt,
  className,
}: ArticleCardHeaderProps) => {
  return (
    <header className={cn("flex items-end justify-between", className)}>
      <div className="flex gap-4">
        <UserAvatar fallback={userName || "U"} avatarUrl={avatarUrl} />
        <ArticleUserInfo
          userName={userName || ""}
          email={email || ""}
          createdAt={createdAt}
        />
      </div>
      <EmotionGauge emotionLevel={emotionLevel} />
    </header>
  );
};

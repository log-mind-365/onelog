import type { ComponentProps } from "react";
import { ArticleUserInfo } from "@/entities/article/ui/article-user-info";
import EmotionGauge from "@/entities/article/ui/emotion-gauge";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { cn } from "@/shared/lib/utils";

const ArticleHeader = ({
  className,
  children,
  ...props
}: ComponentProps<"header">) => {
  return (
    <header className={cn("flex flex-1 gap-4", className)} {...props}>
      {children}
    </header>
  );
};

type ArticleHeaderAvatarProps = ComponentProps<"div"> & {
  userName: string;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const ArticleHeaderAvatar = ({
  userName,
  avatarUrl,
  size = "md",
  className,
  ...props
}: ArticleHeaderAvatarProps) => {
  return (
    <div className={className} {...props}>
      <UserAvatar
        fallback={userName || "U"}
        avatarUrl={avatarUrl}
        size={size}
      />
    </div>
  );
};

type ArticleHeaderUserInfoProps = {
  userName: string;
  email: string;
  createdAt?: Date;
  className?: string;
};

const ArticleHeaderUserInfo = ({
  userName,
  email,
  createdAt,
  className,
  ...props
}: ArticleHeaderUserInfoProps) => {
  return (
    <div className={cn("flex-1", className)} {...props}>
      <ArticleUserInfo
        userName={userName || ""}
        email={email || ""}
        createdAt={createdAt}
      />
    </div>
  );
};

type ArticleHeaderEmotionGaugeProps = {
  emotionLevel: number;
  size?: number;
  className?: string;
};

const ArticleHeaderEmotionGauge = ({
  emotionLevel,
  size,
  className,
  ...props
}: ArticleHeaderEmotionGaugeProps) => {
  return (
    <div className={className} {...props}>
      <EmotionGauge emotionLevel={emotionLevel} size={size} />
    </div>
  );
};

export {
  ArticleHeader,
  ArticleHeaderAvatar,
  ArticleHeaderUserInfo,
  ArticleHeaderEmotionGauge,
};

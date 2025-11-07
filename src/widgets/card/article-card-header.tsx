import Link from "next/link";
import { ArticleUserInfo } from "@/entities/article/ui/article-user-info";
import {
  EMOTION_STATUS,
  EMOTION_PERCENT_COLORS,
} from "@/entities/article/model/constants";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { Button } from "@/shared/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/ui/hover-card";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/model/routes";

type ArticleCardHeaderProps = {
  userId: string;
  userName?: string;
  avatarUrl?: string | null;
  email?: string;
  emotionLevel: number;
  isMe: boolean;
  createdAt: Date;
  onClick?: () => void;
};

export const ArticleCardHeader = ({
  userId,
  userName,
  avatarUrl,
  email,
  emotionLevel,
  isMe,
  createdAt,
}: ArticleCardHeaderProps) => {
  const percentage = emotionLevel;
  const colorClass = EMOTION_PERCENT_COLORS[emotionLevel];
  const label =
    EMOTION_STATUS.find((emotion) => emotion.percent === emotionLevel)?.status ||
    "알 수 없음";

  return (
    <header className="flex items-center gap-4">
      <HoverCard openDelay={0}>
        <HoverCardTrigger asChild>
          <UserAvatar fallback={userName || "U"} avatarUrl={avatarUrl} />
        </HoverCardTrigger>
        <HoverCardContent align="start" side="bottom" className="w-auto p-0">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col items-center gap-4">
              <UserAvatar
                fallback={userName || "U"}
                avatarUrl={avatarUrl}
                size="lg"
              />
              <h3 className="font-semibold text-sm">{userName}</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4"></div>
              <div className="flex gap-4">
                {isMe ? (
                  <>
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={ROUTES.SETTINGS.PROFILE}>프로필 수정</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={ROUTES.PROFILE.VIEW(userId)}>
                        프로필 페이지
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button size="sm" asChild>
                    <Link href={ROUTES.PROFILE.VIEW(userId)}>
                      프로필 페이지
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <ArticleUserInfo
        userName={userName || ""}
        email={email || ""}
        createdAt={createdAt}
      />
      <div className="flex h-full flex-1 items-end justify-end">
        <div className="flex flex-col items-center gap-2 rounded-md p-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">{label}</span>
          </div>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={cn("h-full transition-all", colorClass)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

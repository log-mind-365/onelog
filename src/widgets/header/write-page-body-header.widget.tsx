"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  EMOTION_STATUS,
  type EmotionLevel,
} from "@/entities/article/article.model";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Progress } from "@/shared/components/ui/progress";

type WritePageBodyHeaderProps = {
  avatarUrl?: string | null;
  email?: string | null;
  userName?: string;
  createdAt?: Date;
  emotionLevel: EmotionLevel;
};

export const WritePageBodyHeader = ({
  avatarUrl,
  userName,
  email,
  createdAt,
  emotionLevel,
}: WritePageBodyHeaderProps) => {
  const formattedDate = format(
    new Date(createdAt ?? Date.now()),
    "M월 d일 y년",
    {
      locale: ko,
    },
  );
  const formattedTime = format(new Date(createdAt ?? Date.now()), "HH:mm");

  return (
    <header className="flex items-center gap-4">
      <Avatar className="size-10">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{userName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col">
        <div>
          <span className="font-bold text-sm">{userName}</span>
          <span className="text-muted-foreground text-xs">
            · @{email?.split("@")[0]}
          </span>
        </div>
        <p className="text-muted-foreground text-xs">
          {formattedDate} · {formattedTime}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-xs">
          {
            EMOTION_STATUS.find((emotion) => emotion.percent === emotionLevel)
              ?.status
          }
        </span>
        <Progress value={emotionLevel} className="w-16" />
      </div>
    </header>
  );
};

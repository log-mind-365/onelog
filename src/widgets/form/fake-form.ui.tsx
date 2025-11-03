"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/features/auth-guard/auth-guard.model";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";

export const FakeForm = () => {
  const router = useRouter();
  const { me } = useAuth();
  const { authGuard } = useAuthGuard();

  const handlePostClick = () => {
    authGuard(() => router.push(ROUTES.ARTICLE.NEW));
  };

  return (
    <Card
      className="flex cursor-pointer gap-4 border-0 p-4"
      onClick={handlePostClick}
    >
      <Avatar className="hidden size-10 sm:flex">
        <AvatarImage src={me?.avatarUrl || undefined} />
        <AvatarFallback>
          {me?.userName?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 items-center rounded-md bg-muted/50 p-3 text-muted-foreground text-sm">
        오늘 당신의 생각을 한 줄로 기록하세요.
      </div>
    </Card>
  );
};

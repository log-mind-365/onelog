"use client";

import { useRouter } from "next/navigation";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useAuth } from "@/features/auth/model/store";
import { ROUTES } from "@/shared/model/routes";

export const FakeForm = () => {
  const router = useRouter();
  const { me } = useAuth();
  const { authGuard } = useAuthGuard();

  const handlePostClick = () => {
    authGuard(() => router.push(ROUTES.ARTICLE.NEW));
  };

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer flex-row gap-4 py-4 shadow-none"
      onClick={handlePostClick}
    >
      <UserAvatar fallback={me?.userName || "U"} avatarUrl={me?.avatarUrl} />
      <div className="flex flex-1 items-center rounded-md border-1 bg-card p-3 text-muted-foreground text-sm">
        오늘 당신의 생각을 한 줄로 기록하세요.
      </div>
    </button>
  );
};

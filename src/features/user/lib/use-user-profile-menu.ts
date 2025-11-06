"use client";

import { LogOut, User, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";
import { useModal } from "@/shared/store/use-modal";

export const useUserProfileMenu = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const { me } = useAuth();

  return [
    {
      id: "profile-modify",
      label: "프로필 수정",
      icon: UserCog,
      action: () => router.push(ROUTES.SETTINGS.PROFILE),
    },
    {
      id: "profile",
      label: "프로필 페이지",
      icon: User,
      action: () => router.push(ROUTES.PROFILE.VIEW(me?.id || "")),
    },
    undefined,
    {
      id: "sign-out",
      label: "로그아웃",
      icon: LogOut,
      action: () => openModal("sign-out"),
    },
  ];
};

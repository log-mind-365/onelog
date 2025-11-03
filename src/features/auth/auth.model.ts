import { User, UserPlus } from "lucide-react";
import { useAuth } from "@/shared/store/use-auth";
import { useModal } from "@/shared/store/use-modal";

export const useAuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();

  const authGuard = (callback: any) => {
    if (isAuthenticated) {
      callback();
    } else {
      openModal("auth-guard");
    }
  };

  return { authGuard };
};

export const useAuthMenu = () => {
  const { openModal } = useModal();
  return [
    {
      id: "sign-in",
      label: "로그인",
      icon: () => User,
      action: () => openModal("sign-in"),
    },
    {
      id: "sign-up",
      label: "회원가입",
      icon: UserPlus,
      action: () => openModal("sign-up"),
    },
  ];
};

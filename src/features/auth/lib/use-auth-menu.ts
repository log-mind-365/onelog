import { User, UserPlus } from "lucide-react";
import { useModal } from "@/shared/store/use-modal";

export const useAuthMenu = () => {
  const { openModal } = useModal();
  return [
    {
      id: "sign-in",
      label: "로그인",
      icon: User,
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

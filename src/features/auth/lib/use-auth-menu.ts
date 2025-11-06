import { User, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/model/routes";

export const useAuthMenu = () => {
  const router = useRouter();
  return [
    {
      id: "sign_in",
      label: "로그인",
      icon: User,
      action: () => router.push(ROUTES.AUTH.SIGN_IN),
    },
    {
      id: "sign_up",
      label: "회원가입",
      icon: UserPlus,
      action: () => router.push(ROUTES.AUTH.SIGN_UP),
    },
  ];
};

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

import { useModal } from "@/app/_providers/modal-store";
import { useAuth } from "@/features/auth/model/store";

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

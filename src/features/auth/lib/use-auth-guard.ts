import { useAuth } from "@/features/auth/model/store";
import { useModal } from "@/shared/store/modal-store";

export const useAuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();

  return (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      openModal("auth-guard");
    }
  };
};

import { useState } from "react";
import { useMe } from "@/shared/store/use-me";

export const useAuthGuard = () => {
  const { isAuthenticated } = useMe();
  const [showAuthGuard, setShowAuthGuard] = useState(false);

  const authGuard = (callback: any) => {
    if (isAuthenticated) {
      callback();
    } else {
      setShowAuthGuard(true);
    }
  };

  return { authGuard, showAuthGuard, setShowAuthGuard };
};

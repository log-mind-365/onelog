import { usePathname, useRouter } from "next/navigation";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { ROUTES } from "@/shared/model/routes";

export const useHomePageNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const authGuard = useAuthGuard();

  const isActive = (menuPath?: string) => {
    if (menuPath === ROUTES.HOME) {
      return pathname === menuPath;
    }
    return pathname.startsWith(menuPath!);
  };

  const handleNavigate = (route: string) => {
    if (route === ROUTES.HOME) {
      return router.push(route);
    }
    authGuard(() => router.push(route));
  };

  const handleNavigateHome = () => {
    router.push(ROUTES.HOME);
  };

  return {
    isActive,
    onNavigate: handleNavigate,
    onNavigateHome: handleNavigateHome,
  };
};

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useAuth } from "@/features/auth/model/store";
import { useToggleTheme } from "@/features/toggle-theme/lib/use-toggle-theme";
import { ROUTES } from "@/shared/model/routes";
import { DesktopNavigationMenu } from "@/widgets/home-page-sidebar/ui/desktop-navigation-menu";
import { MobileNavigationMenu } from "@/widgets/home-page-sidebar/ui/mobile-navigation-menu";

export const HomePageNavigationBar = () => {
  const { me, isAuthenticated } = useAuth();
  const { theme, onThemeToggle } = useToggleTheme();
  const router = useRouter();
  const pathname = usePathname();
  const authGuard = useAuthGuard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 right-0 left-0 z-50 m-2 flex items-center justify-between rounded-md border bg-card/50 px-2 py-2 shadow-lg backdrop-blur-lg sm:hidden">
        <MobileNavigationMenu
          onNavigate={handleNavigate}
          isActive={isActive}
          onThemeToggle={onThemeToggle}
          theme={theme}
          isAuthenticated={isAuthenticated}
          userName={me?.userName || ""}
          avatarUrl={me?.avatarUrl || null}
          onNavigateHome={handleNavigateHome}
        />
      </header>

      {/* Desktop Sidebar */}
      <aside className="sticky top-4 ml-4 hidden size-fit flex-col gap-2 rounded-lg border-1 bg-card p-2 shadow-sm sm:flex">
        <DesktopNavigationMenu
          onNavigate={handleNavigate}
          isActive={isActive}
          onThemeToggle={onThemeToggle}
          theme={theme}
          isAuthenticated={isAuthenticated}
          userName={me?.userName || ""}
          avatarUrl={me?.avatarUrl || null}
          onNavigateHome={handleNavigateHome}
        />
      </aside>
    </>
  );
};

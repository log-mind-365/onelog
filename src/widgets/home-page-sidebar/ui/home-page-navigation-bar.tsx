"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useAuth } from "@/features/auth/model/store";
import { AuthMenuDropdown } from "@/features/auth/ui/auth-menu-dropdown";
import { UserProfileMenuDropdown } from "@/features/profile/ui/user-profile-menu-dropdown";
import { useToggleTheme } from "@/features/toggle-theme/lib/use-toggle-theme";
import { ToggleThemeButton } from "@/features/toggle-theme/ui/toggle-theme-button";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { ROUTES } from "@/shared/model/routes";
import {
  APP_LOGO,
  SIDEBAR_MENUS,
} from "@/widgets/home-page-sidebar/model/constants";
import { MobileNavigationMenu } from "@/widgets/home-page-sidebar/ui/mobile-navigation-menu";

export const HomePageNavigationBar = () => {
  const { me, isAuthenticated } = useAuth();
  const { theme, onThemeToggle } = useToggleTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { authGuard } = useAuthGuard();
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

  const LogoIcon = APP_LOGO.icon;

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 right-0 left-0 z-50 m-2 flex items-center justify-between rounded-md border bg-card px-4 py-2 shadow-sm sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(APP_LOGO.path)}
        >
          <Image src="/brand_logo.svg" alt="logo icon" width={24} height={24} />
        </Button>
        <MobileNavigationMenu />
      </header>

      {/* Desktop Sidebar */}
      <aside className="sticky top-4 ml-4 hidden size-fit flex-col gap-2 rounded-lg border-1 bg-card p-2 shadow-sm sm:flex">
        <TooltipProvider delayDuration={0}>
          {/* App Logo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => router.push(APP_LOGO.path)}
              >
                <LogoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{APP_LOGO.label}</p>
            </TooltipContent>
          </Tooltip>

          <Separator />

          {/* Navigation Menus */}
          {SIDEBAR_MENUS.map((menu, index) => {
            if (!menu) {
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              return <Separator key={index} />;
            }

            const Icon = menu.icon;
            const active = isActive(menu.path);

            return (
              <Tooltip key={menu.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant={active ? "default" : "ghost"}
                    onClick={() => handleNavigate(menu.path!)}
                  >
                    <Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{menu.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          <ToggleThemeButton onThemeToggle={onThemeToggle} theme={theme} />

          <Separator />

          {/* Auth / Profile Button */}
          {isAuthenticated ? (
            <UserProfileMenuDropdown
              userName={me?.userName || ""}
              avatarUrl={me?.avatarUrl || undefined}
            />
          ) : (
            <AuthMenuDropdown />
          )}
        </TooltipProvider>
      </aside>
    </>
  );
};

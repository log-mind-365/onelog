"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useAuth } from "@/features/auth/model/store";
import { AuthMenuDropdown } from "@/features/auth/ui/auth-menu-dropdown";
import { useToggleTheme } from "@/features/toggle-theme/lib/use-toggle-theme";
import { ToggleThemeButton } from "@/features/toggle-theme/ui/toggle-theme-button";
import { UserProfileMenuDropdown } from "@/features/user/ui/user-profile-menu-dropdown";
import { SidebarContainer } from "@/shared/components/sidebar-container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { ROUTES } from "@/shared/model/routes";
import { SIDEBAR_MENUS } from "@/views/home/types";

export const HomePageSidebar = () => {
  const { me, isAuthenticated } = useAuth();
  const { theme, onThemeToggle } = useToggleTheme();
  const pathname = usePathname();
  const router = useRouter();
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

  return (
    <SidebarContainer>
      <TooltipProvider delayDuration={0}>
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
    </SidebarContainer>
  );
};

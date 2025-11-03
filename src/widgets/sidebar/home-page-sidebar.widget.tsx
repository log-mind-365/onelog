"use client";

import { User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useAuthGuard } from "@/features/auth-guard/auth-guard.model";
import { useToggleTheme } from "@/features/toggle-theme/toggle-theme.model";
import { ToggleThemeButton } from "@/features/toggle-theme/ui/toggle-theme-button";
import { Container } from "@/shared/components/container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";
import { AuthenticatedDropdownMenu } from "@/widgets/menu/authenticated-dropdown-menu.widget";
import { UnauthenticatedDropdownMenu } from "@/widgets/menu/unauthenticated-dropdown-menu.widget";
import { SIDEBAR_MENUS } from "@/widgets/sidebar/home-page-sidebar-model";

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
    authGuard(() => router.push(route));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Container.Sidebar className="flex flex-col gap-2">
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
                  <Icon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{menu.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <div className="mt-auto flex flex-col gap-2">
          <ToggleThemeButton onThemeToggle={onThemeToggle} theme={theme} />

          <Separator />

          {/* Auth / Profile Button */}
          {isAuthenticated ? (
            <Tooltip>
              <AuthenticatedDropdownMenu>
                <TooltipTrigger asChild>
                  <Button variant="ghost">
                    <UserAvatar
                      fallback={me?.userName || "U"}
                      avatarUrl={me?.avatarUrl}
                    />
                  </Button>
                </TooltipTrigger>
              </AuthenticatedDropdownMenu>
              <TooltipContent side="right">
                <p>프로필</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <UnauthenticatedDropdownMenu>
                <TooltipTrigger asChild>
                  <Button variant="ghost">
                    <User />
                  </Button>
                </TooltipTrigger>
              </UnauthenticatedDropdownMenu>
              <TooltipContent side="right">
                <p>로그인</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </Container.Sidebar>
    </TooltipProvider>
  );
};

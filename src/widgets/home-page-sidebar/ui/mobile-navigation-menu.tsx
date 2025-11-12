"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useAuthGuard } from "@/features/auth/lib/use-auth-guard";
import { useAuthMenu } from "@/features/auth/lib/use-auth-menu";
import { useAuth } from "@/features/auth/model/store";
import { useUserProfileMenu } from "@/features/profile/lib/use-user-profile-menu";
import { useToggleTheme } from "@/features/toggle-theme/lib/use-toggle-theme";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ROUTES } from "@/shared/model/routes";
import { SIDEBAR_MENUS } from "@/widgets/home-page-sidebar/model/constants";

export const MobileNavigationMenu = () => {
  const { me, isAuthenticated } = useAuth();
  const { theme, onThemeToggle } = useToggleTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { authGuard } = useAuthGuard();
  const profileMenuItems = useUserProfileMenu();
  const authMenuItems = useAuthMenu();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {isAuthenticated ? (
            <UserAvatar
              fallback={me?.userName || "U"}
              avatarUrl={me?.avatarUrl}
              size="sm"
            />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>메뉴</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navigation Menus */}
        {SIDEBAR_MENUS.map((menu, index) => {
          if (!menu) {
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            return <DropdownMenuSeparator key={index} />;
          }

          const Icon = menu.icon;
          const active = isActive(menu.path);

          return (
            <DropdownMenuItem
              key={menu.label}
              onClick={() => handleNavigate(menu.path!)}
              className={active ? "bg-accent" : ""}
            >
              <Icon className="size-4" />
              <span>{menu.label}</span>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuItem onClick={onThemeToggle}>
          {theme === "dark" ? (
            <>
              <Sun className="size-4" />
              <span>라이트 모드</span>
            </>
          ) : (
            <>
              <Moon className="size-4" />
              <span>다크 모드</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Profile or Auth Menus */}
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>프로필</DropdownMenuLabel>
            {profileMenuItems.map((item, index) => {
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              if (!item) return <DropdownMenuSeparator key={index} />;

              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.id} onClick={item.action}>
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
          </>
        ) : (
          authMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.id} onClick={item.action}>
                <Icon className="size-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

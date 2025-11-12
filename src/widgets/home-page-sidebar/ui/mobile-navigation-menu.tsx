"use client";

import { Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useAuthMenu } from "@/features/auth/lib/use-auth-menu";
import { useUserProfileMenu } from "@/features/profile/lib/use-user-profile-menu";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SIDEBAR_MENUS } from "@/widgets/home-page-sidebar/model/constants";

type MobileNavigationMenuProps = {
  onNavigate: (route: string) => void;
  isActive: (menuPath?: string) => boolean;
  onThemeToggle: () => void;
  theme?: string;
  isAuthenticated: boolean;
  userName: string;
  avatarUrl: string | null;
  onNavigateHome: () => void;
};
export const MobileNavigationMenu = ({
  onNavigate,
  isActive,
  onThemeToggle,
  theme,
  isAuthenticated,
  userName,
  avatarUrl,
  onNavigateHome,
}: MobileNavigationMenuProps) => {
  const profileMenuItems = useUserProfileMenu();
  const authMenuItems = useAuthMenu();

  return (
    <>
      <Button variant="ghost" size="icon" onClick={onNavigateHome}>
        <Image src="/brand_logo.svg" alt="logo icon" width={24} height={24} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {isAuthenticated ? (
              <UserAvatar fallback={userName} avatarUrl={avatarUrl} size="sm" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>메뉴</DropdownMenuLabel>

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
                onClick={() => onNavigate(menu.path!)}
                className={active ? "bg-accent" : ""}
              >
                <Icon className="size-4" />
                <span>{menu.label}</span>
              </DropdownMenuItem>
            );
          })}

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
    </>
  );
};

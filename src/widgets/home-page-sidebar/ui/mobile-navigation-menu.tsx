"use client";

import { Menu, Monitor, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useAuthMenu } from "@/features/auth/lib/use-auth-menu";
import { useUserProfileMenu } from "@/features/profile/lib/use-user-profile-menu";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SIDEBAR_MENUS } from "@/widgets/home-page-sidebar/model/constants";

type MobileNavigationMenuProps = {
  onNavigate: (route: string) => void;
  isActive: (menuPath?: string) => boolean;
  theme?: string;
  isAuthenticated: boolean;
  userName: string;
  avatarUrl: string | null;
  onNavigateHome: () => void;
};
export const MobileNavigationMenu = ({
  onNavigate,
  isActive,
  theme,
  isAuthenticated,
  userName,
  avatarUrl,
  onNavigateHome,
}: MobileNavigationMenuProps) => {
  const profileMenuItems = useUserProfileMenu();
  const authMenuItems = useAuthMenu();
  const { setTheme } = useTheme();

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

          <DropdownMenuSeparator />

          {/* Theme Toggle */}
          <DropdownMenuLabel>테마 설정</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">
              <Sun className="mr-2 h-4 w-4" />
              라이트
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon className="mr-2 h-4 w-4" />
              다크
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor className="mr-2 h-4 w-4" />
              시스템
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

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

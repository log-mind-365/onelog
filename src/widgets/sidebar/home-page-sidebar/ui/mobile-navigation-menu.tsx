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
import { SIDEBAR_MENUS } from "@/widgets/sidebar/home-page-sidebar/model/constants";

type MobileNavigationMenuProps = {
  onNavigate: (route: string) => void;
  isActive: (menuPath?: string) => boolean;
  isAuthenticated: boolean;
  userName: string;
  avatarUrl: string | null;
};
export const MobileNavigationMenu = ({
  onNavigate,
  isActive,
  isAuthenticated,
  userName,
  avatarUrl,
}: MobileNavigationMenuProps) => {
  const profileMenuItems = useUserProfileMenu();
  const authMenuItems = useAuthMenu();
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu aria-label="메뉴" aria-role="nav">
      <DropdownMenuTrigger asChild>
        <Button aria-label="메뉴 열기" variant="ghost" size="icon">
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
          if (menu.type === "divider") {
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            return <DropdownMenuSeparator key={index} />;
          }

          const active = isActive(menu.href);

          return (
            <DropdownMenuItem
              key={menu.label}
              aria-label={menu.label}
              onClick={() => onNavigate(menu.href)}
              className={active ? "bg-accent" : ""}
            >
              {menu.type === "icon" ? (
                <menu.icon className="size-4" />
              ) : (
                <Image
                  src="/brand_logo.svg"
                  alt="logo icon"
                  width={24}
                  height={24}
                />
              )}
              <span>{menu.label}</span>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuLabel>테마 설정</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          aria-label="테마 설정"
          value={theme}
          onValueChange={setTheme}
        >
          <DropdownMenuRadioItem aria-label="라이트" value="light">
            <Sun className="mr-2 h-4 w-4" />
            라이트
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem aria-label="다크" value="dark">
            <Moon className="mr-2 h-4 w-4" />
            다크
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem aria-label="커스텀" value="system">
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

              return (
                <DropdownMenuItem
                  aria-label={item.label}
                  key={item.id}
                  onClick={item.action}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
          </>
        ) : (
          authMenuItems.map((item) => {
            return (
              <DropdownMenuItem
                aria-label="로그아웃"
                key={item.id}
                onClick={item.action}
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

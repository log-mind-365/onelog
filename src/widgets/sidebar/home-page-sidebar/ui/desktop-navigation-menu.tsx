import { Monitor, Moon, Palette, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { AuthMenuDropdown } from "@/features/auth/ui/auth-menu-dropdown";
import { UserProfileMenuDropdown } from "@/features/profile/ui/user-profile-menu-dropdown";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { SIDEBAR_MENUS } from "@/widgets/sidebar/home-page-sidebar/model/constants";

type DesktopNavigationMenuProps = {
  onNavigate: (route: string) => void;
  isActive: (menuPath?: string) => boolean;
  isAuthenticated: boolean;
  userName: string;
  avatarUrl: string | null;
};

export const DesktopNavigationMenu = ({
  onNavigate,
  isActive,
  isAuthenticated,
  userName,
  avatarUrl,
}: DesktopNavigationMenuProps) => {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider delayDuration={0}>
      {/* Navigation Menus */}
      {SIDEBAR_MENUS.map((menu, index) => {
        if (menu.type === "divider") {
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          return <Separator key={index} />;
        }
        const active = isActive(menu.href);

        return (
          <Tooltip key={menu.label}>
            <TooltipTrigger asChild>
              <Button
                variant={active ? "default" : "ghost"}
                size="icon"
                onClick={() => onNavigate(menu.href)}
              >
                {menu.type === "icon" ? (
                  <menu.icon />
                ) : (
                  <Image
                    src="/brand_logo.svg"
                    alt="logo icon"
                    width={24}
                    height={24}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{menu.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      <Separator />

      {/* Theme Toggle */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>테마</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuLabel>테마 설정</DropdownMenuLabel>
          <DropdownMenuSeparator />
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
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator />

      {/* Auth / Profile Button */}
      {isAuthenticated ? (
        <UserProfileMenuDropdown userName={userName} avatarUrl={avatarUrl} />
      ) : (
        <AuthMenuDropdown />
      )}
    </TooltipProvider>
  );
};

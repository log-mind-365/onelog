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
import {
  APP_LOGO,
  SIDEBAR_MENUS,
} from "@/widgets/home-page-sidebar/model/constants";

type DesktopNavigationMenuProps = {
  onNavigate: (route: string) => void;
  isActive: (menuPath?: string) => boolean;
  onThemeToggle: () => void;
  theme?: string;
  isAuthenticated: boolean;
  userName: string;
  avatarUrl: string | null;
  onNavigateHome: () => void;
};

export const DesktopNavigationMenu = ({
  onNavigate,
  isActive,
  onThemeToggle,
  theme,
  isAuthenticated,
  userName,
  avatarUrl,
  onNavigateHome,
}: DesktopNavigationMenuProps) => {
  const { setTheme } = useTheme();

  return (
    <TooltipProvider delayDuration={0}>
      {/* App Logo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onNavigateHome}>
            <Image
              src="/brand_logo.svg"
              alt="logo icon"
              width={24}
              height={24}
            />
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
                size="icon"
                onClick={() => onNavigate(menu.path!)}
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

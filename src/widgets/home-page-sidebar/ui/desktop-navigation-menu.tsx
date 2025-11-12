import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { AuthMenuDropdown } from "@/features/auth/ui/auth-menu-dropdown";
import { UserProfileMenuDropdown } from "@/features/profile/ui/user-profile-menu-dropdown";
import { Button } from "@/shared/components/ui/button";
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

      <Button variant="ghost" size="icon" onClick={onThemeToggle}>
        {theme === "dark" ? <Moon /> : <Sun />}
      </Button>

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

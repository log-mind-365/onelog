"use client";

import { Moon, PenSquare, Sun, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useAuthGuard } from "@/features/auth-guard/auth-guard.model";
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
import { TOP_MENUS } from "@/widgets/sidebar/home-page-sidebar-model";

export const HomePageSidebar = () => {
  const { me } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { authGuard } = useAuthGuard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (menuPath: string) => {
    if (menuPath === ROUTES.HOME) {
      return pathname === menuPath;
    }
    return pathname.startsWith(menuPath);
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNavigate = (route: string) => {
    authGuard(() => router.push(route));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Container.Sidebar>
        {/* Write Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={pathname === ROUTES.ARTICLE.NEW ? "default" : "ghost"}
              onClick={() => handleNavigate(ROUTES.ARTICLE.NEW)}
            >
              <PenSquare />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>글쓰기</p>
          </TooltipContent>
        </Tooltip>

        <Separator />

        {/* Top Navigation */}
        <div className="flex flex-col gap-2">
          {TOP_MENUS.map((menu) => {
            const Icon = menu.icon;
            const active = isActive(menu.path);

            return (
              <Tooltip key={menu.name}>
                <TooltipTrigger asChild>
                  <Button variant={active ? "default" : "ghost"}>
                    <Link href={menu.path}>
                      <Icon className="size-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{menu.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleThemeToggle}>
                {theme === "dark" ? <Moon /> : <Sun />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>테마 변경</p>
            </TooltipContent>
          </Tooltip>

          <Separator />

          {/* Auth / Profile Button */}
          {me ? (
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

"use client";

import { Home, Moon, PenSquare, Sun, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { SignInModal } from "@/features/sign-in/sign-in-modal.ui";
import { SignUpModal } from "@/features/sign-up/sign-up-modal.ui";
import { Container } from "@/shared/components/container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { ROUTES } from "@/shared/routes";
import { useMe } from "@/shared/store/use-me";
import { AuthenticatedDropdownMenu } from "@/widgets/menu/authenticated-dropdown-menu.widget";
import { UnauthenticatedDropdownMenu } from "@/widgets/menu/unauthenticated-dropdown-menu.widget";

const TOP_MENUS = [
  {
    name: "홈",
    icon: Home,
    path: ROUTES.HOME,
  },
];

export const HomePageSidebar = () => {
  const { me } = useMe();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
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

  const handleAuthClick = () => {
    router.push(ROUTES.USER.VIEW(me?.id || ""));
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Container.Sidebar>
        {/* Write Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={pathname === ROUTES.ARTICLE.NEW ? "default" : "ghost"}
              asChild
            >
              <Link href={ROUTES.ARTICLE.NEW}>
                <PenSquare />
              </Link>
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
                  <Button variant={active ? "default" : "ghost"} asChild>
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
              <UnauthenticatedDropdownMenu
                onSwitchToSignIn={handleSwitchToSignIn}
                onSwitchToSignUp={handleSwitchToSignUp}
              >
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

      {/* Auth Dialogs */}
      <SignInModal
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </TooltipProvider>
  );
};

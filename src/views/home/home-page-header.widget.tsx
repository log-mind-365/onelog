"use client";

import { Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useUserProfileMenu } from "@/features/user/lib/use-user-profile-menu";
import { UserProfileMenuDropdown } from "@/features/user/ui/user-profile-menu-dropdown";
import { HeaderContainer } from "@/shared/components/header-container";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";
import { HEADER_TOP_MENUS } from "@/views/home/home-page-header.model";

export const HomePageHeader = () => {
  const { me } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
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

  const handleProfileClick = () => {
    if (me) {
      router.push(ROUTES.PROFILE.VIEW(me.id));
      setOpen(false);
    }
  };

  return (
    <HeaderContainer>
      <nav className="flex h-full w-full items-center justify-between">
        <UserProfileMenuDropdown
          userName={me?.userName || ""}
          avatarUrl={me?.avatarUrl || undefined}
        />
        <div>
          <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
            <div className="flex size-5 overflow-hidden">
              <div
                className={cn(
                  "transition-transform duration-300",
                  theme === "dark" ? "-translate-y-5" : "translate-y-0",
                )}
              >
                <Sun className="size-5" />
                <Moon className="size-5" />
              </div>
            </div>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-2/3 px-4">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>

              <div className="mt-4 flex flex-col gap-4">
                {HEADER_TOP_MENUS.map((menu, index) => {
                  if (!menu) {
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    return <Separator key={index} />;
                  }

                  const Icon = menu.icon;
                  const active = isActive(menu.path);

                  return (
                    <Button
                      key={menu.name}
                      variant={active ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href={menu.path}>
                        <Icon />
                        <span>{menu.name}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>

              <SheetFooter>
                <div className="mt-4 text-center text-muted-foreground text-xs">
                  © 2024 One-Sentence. All rights reserved.
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </HeaderContainer>
  );
};

function HomePageDrawer() {}

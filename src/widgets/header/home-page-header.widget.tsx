"use client";

import { LogIn, Menu, Moon, PenSquare, Sun, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { UserBaseInfo } from "@/entities/user/ui/user-base-info";
import { Container } from "@/shared/components/container";
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
import { useModal } from "@/shared/store/use-modal";
import { HEADER_TOP_MENUS } from "@/widgets/header/home-page-header.model";

export const HomePageHeader = () => {
  const { me } = useAuth();
  const { openModal } = useModal();
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
      router.push(ROUTES.USER.VIEW(me.id));
      setOpen(false);
    }
  };

  return (
    <Container.Header>
      <nav className="flex h-full items-center justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-2/3 px-4">
            <SheetHeader>
              <SheetTitle>메뉴</SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-4">
              {/* Write Button */}
              <Button
                variant={
                  pathname === ROUTES.ARTICLE.NEW ? "default" : "outline"
                }
                className="w-full justify-start gap-2"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={ROUTES.ARTICLE.NEW}>
                  <PenSquare />
                  <span>글쓰기</span>
                </Link>
              </Button>

              <Separator />

              {/* Top Navigation */}
              <div className="flex flex-col gap-2">
                {HEADER_TOP_MENUS.map((menu) => {
                  const Icon = menu.icon;
                  const active = isActive(menu.path);

                  return (
                    <Button
                      key={menu.name}
                      variant={active ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link href={menu.path}>
                        <Icon />
                        <span>{menu.name}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>

              <div className="flex-1" />

              <Separator />

              {/* Auth / Profile Section */}
              {me ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleProfileClick}
                >
                  <UserAvatar fallback={me.userName} avatarUrl={me.avatarUrl} />
                  <UserBaseInfo userName={me.userName} email={me.email} />
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => openModal("sign-in")}
                  >
                    <LogIn />
                    <span>로그인</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => openModal("sign-up")}
                  >
                    <UserPlus />
                    <span>회원가입</span>
                  </Button>
                </div>
              )}
            </div>

            <SheetFooter>
              <div className="mt-4 text-center text-muted-foreground text-xs">
                © 2024 One-Sentence. All rights reserved.
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>

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
      </nav>
    </Container.Header>
  );
};

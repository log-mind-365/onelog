"use client";

import { useAuth } from "@/features/auth/model/store";
import { useHomePageNavigation } from "@/widgets/home-page-sidebar/lib/use-home-page-navigation";
import { DesktopNavigationMenu } from "@/widgets/home-page-sidebar/ui/desktop-navigation-menu";
import { MobileNavigationMenu } from "@/widgets/home-page-sidebar/ui/mobile-navigation-menu";

export const HomePageNavigationBar = () => {
  const { me, isAuthenticated } = useAuth();
  const { onNavigateHome, onNavigate, isActive } = useHomePageNavigation();

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 right-0 left-0 z-50 m-2 flex items-center justify-between rounded-md border bg-card/50 px-2 py-2 shadow-lg backdrop-blur-lg sm:hidden">
        <MobileNavigationMenu
          onNavigate={onNavigate}
          isActive={isActive}
          isAuthenticated={isAuthenticated}
          userName={me?.userName || ""}
          avatarUrl={me?.avatarUrl || null}
          onNavigateHome={onNavigateHome}
        />
      </header>

      {/* Desktop Sidebar */}
      <aside className="sticky top-4 hidden size-fit flex-col gap-2 rounded-lg border-1 bg-card p-2 shadow-sm sm:flex">
        <DesktopNavigationMenu
          onNavigate={onNavigate}
          isActive={isActive}
          isAuthenticated={isAuthenticated}
          userName={me?.userName || ""}
          avatarUrl={me?.avatarUrl || null}
          onNavigateHome={onNavigateHome}
        />
      </aside>
    </>
  );
};

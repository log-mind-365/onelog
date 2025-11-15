import type { PropsWithChildren } from "react";
import { HomePageNavigationBar } from "@/widgets/home-page-sidebar/ui/home-page-navigation-bar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex flex-row items-start justify-center">
      <HomePageNavigationBar />
      <div className="mt-18 w-full sm:mt-0 sm:w-lg md:w-xl lg:w-2xl">
        {children}
      </div>
    </main>
  );
};

export default Layout;

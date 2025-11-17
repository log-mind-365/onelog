import type { PropsWithChildren } from "react";
import { HomePageNavigationBar } from "@/widgets/sidebar/home-page-sidebar/ui/home-page-navigation-bar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-row items-start justify-center">
      <HomePageNavigationBar />
      <div className="mt-18 w-full sm:mt-0 sm:w-lg md:w-xl lg:w-2xl">
        {children}
      </div>
    </div>
  );
};

export default Layout;

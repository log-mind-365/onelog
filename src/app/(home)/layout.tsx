import type { PropsWithChildren } from "react";
import { HomePageSidebar } from "@/widgets/home-page-sidebar/ui/home-page-sidebar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-screen flex-row items-start justify-center">
      <HomePageSidebar />
      <main className="w-full sm:w-lg md:w-xl lg:w-2xl">{children}</main>
    </main>
  );
};

export default Layout;

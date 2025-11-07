import type { PropsWithChildren } from "react";
import { WritePageHeader } from "@/views/write/write-page-header.widget";
import { WritePageSidebar } from "@/views/write/write-page-sidebar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <WritePageHeader />
      <WritePageSidebar />
      {children}
    </>
  );
};

export default Layout;

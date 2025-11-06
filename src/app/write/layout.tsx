import type { PropsWithChildren } from "react";
import { WritePageLayout } from "@/views/write/write-page-layout";

const Layout = ({ children }: PropsWithChildren) => {
  return <WritePageLayout>{children}</WritePageLayout>;
};

export default Layout;

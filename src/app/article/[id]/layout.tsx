import type { PropsWithChildren } from "react";
import { ArticleDetailPageLayout } from "@/views/article/article-detail-page-layout";

const Layout = ({ children }: PropsWithChildren) => {
  return <ArticleDetailPageLayout>{children}</ArticleDetailPageLayout>;
};

export default Layout;

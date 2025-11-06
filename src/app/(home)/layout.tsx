import type { PropsWithChildren } from "react";
import { HomePageLayout } from "@/views/home/home-page-layout";

const HomeLayout = ({ children }: PropsWithChildren) => {
  return <HomePageLayout>{children}</HomePageLayout>;
};

export default HomeLayout;

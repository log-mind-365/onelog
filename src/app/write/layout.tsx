import type { PropsWithChildren } from "react";
import { Container } from "@/shared/components/container";

const Layout = ({ children }: PropsWithChildren) => {
  return <Container.Layout>{children}</Container.Layout>;
};

export default Layout;

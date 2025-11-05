import type { PropsWithChildren } from "react";
import { Container } from "@/shared/components/container";

const Layout = ({ children }: PropsWithChildren) => {
  return <Container.Body>{children}</Container.Body>;
};

export default Layout;

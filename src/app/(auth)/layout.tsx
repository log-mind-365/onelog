import type { PropsWithChildren } from "react";
import { AuthPageLayout } from "@/views/auth/auth-page-layout";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <AuthPageLayout>{children}</AuthPageLayout>;
};

export default AuthLayout;

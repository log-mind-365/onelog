import type { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
      {children}
    </main>
  );
};

export default AuthLayout;

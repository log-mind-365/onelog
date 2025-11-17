import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/app/_provider/auth-provider";
import { ModalProvider } from "@/app/_provider/modal-provider";
import { QueryProvider } from "@/app/_provider/query-provider";
import { ThemeProvider } from "@/app/_provider/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          {children}
          <ModalProvider />
          <Toaster />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

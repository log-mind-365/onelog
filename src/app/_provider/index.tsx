import type { PropsWithChildren } from "react";
import { ModalHandler } from "@/app/_provider/modal-handler";
import { QueryProvider } from "@/app/_provider/query-provider";
import { ThemeProvider } from "@/app/_provider/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <ModalHandler />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
};

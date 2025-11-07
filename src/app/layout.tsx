import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/shared/provider/query-provider";
import { ThemeProvider } from "@/shared/provider/theme-provider";
import "./globals.css";
import { Modal } from "@/shared/provider/modal-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | OneLog",
    default: "OneLog",
  },
  description: "하루 한 문장씩 - 당신의 감정을 기록하세요.",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
            <Modal />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;

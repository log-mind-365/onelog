import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/app/_provider";

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
      <body className="antialiased" suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;

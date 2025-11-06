import type { ComponentProps } from "react";

export const HeaderContainer = ({ children }: ComponentProps<"header">) => {
  return (
    <header className="sticky top-0 z-50 flex w-full bg-card/60 p-2 shadow-sm backdrop-blur-xl sm:hidden">
      {children}
    </header>
  );
};

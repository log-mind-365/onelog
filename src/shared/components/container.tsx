import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

const Sidebar = ({ className, children }: ComponentProps<"aside">) => {
  return (
    <aside
      className={cn(
        "hidden h-fit flex-col gap-2 rounded-lg bg-card p-2 shadow-md sm:my-8 sm:flex",
        className,
      )}
    >
      {children}
    </aside>
  );
};

const Header = ({ className, children }: ComponentProps<"header">) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex w-full bg-card/60 p-2 shadow-sm backdrop-blur-xl sm:hidden",
        className,
      )}
    >
      {children}
    </header>
  );
};

const Layout = ({ className, children }: ComponentProps<"div">) => {
  return (
    <main
      className={cn(
        "flex flex-col items-start justify-center gap-4 sm:flex-row",
        className,
      )}
    >
      {children}
    </main>
  );
};
type BodyProps = ComponentProps<"div"> & {
  variant?: "default" | "write";
};

const variantsBody = cva(
  "flex h-[calc(100vh-5.2rem)] w-full flex-col gap-4 sm:my-8 sm:h-[calc(100vh-4rem)] sm:w-md md:w-lg lg:w-2xl",
  {
    variants: {
      variant: {
        default: "px-4",
        write: "bg-card p-4 shadow-md sm:rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Body = ({ variant = "default", className, children }: BodyProps) => {
  return (
    <div className={cn(variantsBody({ variant }), className)}>{children}</div>
  );
};

export const Container = { Sidebar, Body, Layout, Header };

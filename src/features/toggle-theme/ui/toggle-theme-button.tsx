"use client";

import { Moon, Sun } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/shared/components/ui/button";

type ToggleThemeButton = ComponentProps<"button"> & {
  onThemeToggle: () => void;
  theme?: string;
};

export const ToggleThemeButton = ({
  onThemeToggle,
  theme,
  className,
}: ToggleThemeButton) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onThemeToggle}
      className={className}
    >
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
};

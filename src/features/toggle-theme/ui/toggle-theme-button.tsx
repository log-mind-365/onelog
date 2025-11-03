"use client";

import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type ToggleThemeButton = TooltipContentProps & {
  onThemeToggle: () => void;
  theme?: string;
};

export const ToggleThemeButton = ({
  onThemeToggle,
  theme,
  side = "right",
}: ToggleThemeButton) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" onClick={onThemeToggle}>
          {theme === "dark" ? <Moon /> : <Sun />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p>테마 변경</p>
      </TooltipContent>
    </Tooltip>
  );
};

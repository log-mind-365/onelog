"use client";

import type { VariantProps } from "class-variance-authority";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { Button, type buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/helpers/client-helper";

export const BackButton = ({
  variant = "ghost",
  size = "icon",
  onClick,
  className,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) => {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick ? onClick : () => router.back()}
      className={cn("self-start", className)}
      {...props}
    >
      <ArrowLeft />
    </Button>
  );
};

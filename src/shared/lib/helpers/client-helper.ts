import { isServer } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const copyURL = async () => {
  if (!isServer) {
    const fullURL = window.location.href;
    await navigator.clipboard.writeText(fullURL);
    toast.success("URL이 클립보드에 복사되었습니다.");
  }
};

import { isServer } from "@tanstack/react-query";
import { toast } from "sonner";
import { TOAST_MESSAGE } from "@/shared/model/constants";

export const useShareArticle = () => {
  const handleShareClick = async () => {
    const fullURL = !isServer ? window.location.href : "";
    await navigator.clipboard.writeText(fullURL);
    toast.success(TOAST_MESSAGE.SHARE.CLIPBOARD);
  };

  return { onShareClick: handleShareClick };
};

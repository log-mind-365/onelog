import { isServer } from "@tanstack/react-query";
import { toast } from "sonner";
import { SHARE_MESSAGE } from "@/shared/model/constants";

export const useShareArticle = () => {
  const handleShareClick = async () => {
    const fullURL = !isServer ? window.location.href : "";
    await navigator.clipboard.writeText(fullURL);
    toast.success(SHARE_MESSAGE.CLIPBOARD);
  };

  return { onShareClick: handleShareClick };
};

import { Home, PenSquare, XIcon } from "lucide-react";
import { ROUTES } from "@/shared/model/routes";

type SIDEBAR_MENUS_TYPE = {
  label: string;
  icon: any;
  path?: string;
  action?: () => void;
};

export const APP_LOGO = {
  label: "OneLog",
  icon: XIcon,
  path: ROUTES.HOME,
};

export const SIDEBAR_MENUS: Partial<SIDEBAR_MENUS_TYPE[]> = [
  {
    label: "글쓰기",
    icon: PenSquare,
    path: ROUTES.ARTICLE.NEW,
  },
  {
    label: "홈",
    icon: Home,
    path: ROUTES.HOME,
  },
  undefined,
];

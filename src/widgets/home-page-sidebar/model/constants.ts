import { Home, PenSquare, XIcon } from "lucide-react";
import { ROUTES } from "@/shared/model/routes";

export const APP_LOGO = {
  label: "OneLog",
  icon: XIcon,
  path: ROUTES.HOME,
};

export const SIDEBAR_MENUS: (
  | {
      label: string;
      icon: any;
      path: string;
    }
  | undefined
)[] = [
  {
    label: "글쓰기",
    icon: PenSquare,
    path: ROUTES.ARTICLE.NEW,
  },
  undefined, // Separator
  {
    label: "홈",
    icon: Home,
    path: ROUTES.HOME,
  },
];

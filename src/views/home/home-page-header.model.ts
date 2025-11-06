import { Home, PenSquare } from "lucide-react";
import { ROUTES } from "@/shared/model/routes";

export const HEADER_TOP_MENUS = [
  {
    name: "글쓰기",
    icon: PenSquare,
    path: ROUTES.ARTICLE.NEW,
  },
  {
    name: "홈",
    icon: Home,
    path: ROUTES.HOME,
  },
  undefined,
];

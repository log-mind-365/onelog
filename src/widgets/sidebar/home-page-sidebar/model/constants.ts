import { Home } from "lucide-react";
import { ROUTES } from "@/shared/model/routes";
import type { NavItem } from "@/widgets/sidebar/home-page-sidebar/model/types";

export const SIDEBAR_MENUS: NavItem[] = [
  {
    type: "image",
    label: "글쓰기",
    image: "/brand_logo.svg",
    href: ROUTES.ARTICLE.NEW,
  },
  { type: "divider" },
  {
    type: "icon",
    label: "홈",
    icon: Home,
    href: ROUTES.HOME,
  },
];

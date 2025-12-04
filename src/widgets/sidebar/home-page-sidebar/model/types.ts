import type { LucideIcon } from "lucide-react";

type BaseNavItem = {
  label: string;
  href: string;
};

type IconNavItem = BaseNavItem & {
  type: "icon";
  icon: LucideIcon;
};

type ImageNavItem = BaseNavItem & {
  type: "image";
  image: string;
};

type DividerItem = {
  type: "divider";
};

export type NavItem = IconNavItem | ImageNavItem | DividerItem;

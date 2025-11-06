import type { PropsWithChildren } from "react";

export const CenterContainer = ({ children }: PropsWithChildren) => {
  return <div className="flex items-center justify-center">{children}</div>;
};

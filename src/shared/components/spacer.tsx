interface SpacerProps {
  flex?: number;
  className?: string;
}

export const Spacer = ({ flex = 1, className }: SpacerProps) => {
  return <div className={className} style={{ flex }} aria-hidden />;
};

import type { ComponentProps } from "react";
import type { EmotionLevel } from "@/entities/article/model/types";
import { cn } from "@/shared/lib/utils";

type EmotionGaugeProps = ComponentProps<"div"> & {
  emotionLevel: EmotionLevel;
  size?: number;
  label: string;
};

export default function EmotionGauge({
  emotionLevel,
  className,
  onClick,
  label,
}: EmotionGaugeProps) {
  let emotionBlock = [0, 0, 0, 0, 0];

  switch (emotionLevel) {
    case 0:
      emotionBlock = [1, 0, 0, 0, 0];
      break;
    case 25:
      emotionBlock = [1, 1, 0, 0, 0];
      break;
    case 50:
      emotionBlock = [1, 1, 1, 0, 0];
      break;
    case 75:
      emotionBlock = [1, 1, 1, 1, 0];
      break;
    case 100:
      emotionBlock = [1, 1, 1, 1, 1];
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn("flex items-end", className)}>
        {emotionBlock!.map((shouldRender, index) => (
          <RenderEmotionBlock
            key={index}
            index={index}
            onClick={onClick}
            shouldRender={!!shouldRender}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

type RenderEmotionBlockProps = ComponentProps<"div"> & {
  shouldRender: boolean;
  index: number;
};

function RenderEmotionBlock({ shouldRender, index }: RenderEmotionBlockProps) {
  let opacity: string = "";
  let height: string = "";

  switch (index) {
    case 0:
      opacity = shouldRender ? "opacity-40" : "";
      height = shouldRender ? "h-[20%]" : "";
      break;
    case 1:
      opacity = shouldRender ? "opacity-55" : "";
      height = shouldRender ? "h-[40%]" : "";
      break;
    case 2:
      opacity = shouldRender ? "opacity-70" : "";
      height = shouldRender ? "h-[60%]" : "";
      break;
    case 3:
      opacity = shouldRender ? "opacity-85" : "";
      height = shouldRender ? "h-[80%]" : "";
      break;
    case 4:
      opacity = shouldRender ? "opacity-100" : "";
      height = shouldRender ? "h-full" : "";
      break;
    default:
      break;
  }
  return (
    <div className="flex h-4 items-end overflow-hidden">
      <div
        className={cn(
          "h-[20%] w-2 rounded-[4px] bg-zinc-400 opacity-25 shadow-sm transition-all dark:bg-zinc-300",
          height,
          opacity,
        )}
      />
      <div className="w-px" />
    </div>
  );
}

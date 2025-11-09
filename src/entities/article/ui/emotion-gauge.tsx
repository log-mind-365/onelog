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
            shouldRender={shouldRender}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

type RenderEmotionBlockProps = ComponentProps<"div"> & {
  shouldRender: number;
  index: number;
};

function RenderEmotionBlock({ shouldRender, index }: RenderEmotionBlockProps) {
  let blockOpacity: string;
  let sizeString: string;

  switch (index) {
    case 0:
      blockOpacity = "opacity-40";
      break;
    case 1:
      blockOpacity = "opacity-55";
      sizeString = shouldRender ? "h-[12px]" : "";
      break;
    case 2:
      blockOpacity = "opacity-70";
      sizeString = shouldRender ? "h-[16px]" : "";
      break;
    case 3:
      blockOpacity = "opacity-85";
      sizeString = shouldRender ? "h-[20px]" : "";
      break;
    case 4:
      blockOpacity = "opacity-100";
      sizeString = shouldRender ? "h-[24px]" : "";
      break;
    default:
      break;
  }
  return (
    <div className="flex h-full items-end overflow-hidden">
      <div
        className={cn(
          "size-full h-2 rounded-full bg-zinc-400 p-1 shadow-sm transition-all dark:bg-zinc-300",
          sizeString!,
          blockOpacity!,
        )}
      />
      <div className="w-px" />
    </div>
  );
}

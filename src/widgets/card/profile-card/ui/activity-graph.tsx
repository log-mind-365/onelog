"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { articleQueries } from "@/entities/article/api/queries";
import { Spacer } from "@/shared/components/spacer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type EmotionActivityGraphProps = {
  userId: string;
};

// 감정 수준에 따른 색상 매핑
const getEmotionColor = (emotionLevel: number | null) => {
  if (emotionLevel === null) return "bg-muted";
  if (emotionLevel >= 5) return "bg-green-500";
  if (emotionLevel >= 4) return "bg-green-400";
  if (emotionLevel >= 3) return "bg-yellow-400";
  if (emotionLevel >= 2) return "bg-orange-400";
  return "bg-red-400";
};

// 특정 년도의 주 단위 데이터 생성 (1월 1일부터)
const generateWeeksData = (year: number) => {
  const weeks: (Date | null)[][] = [];
  const today = new Date();
  const isCurrentYear = year === today.getFullYear();

  // 1월 1일
  const startOfYear = new Date(year, 0, 1);
  const startDay = startOfYear.getDay(); // 0 (일) ~ 6 (토)

  // 1월 1일이 속한 주의 일요일
  const firstSunday = new Date(startOfYear);
  firstSunday.setDate(startOfYear.getDate() - startDay);

  // 년도의 마지막 날 또는 오늘 중 작은 날짜
  const endDate = isCurrentYear ? today : new Date(year, 11, 31);

  // 필요한 주 수 계산 (최대 53주)
  const totalDays = Math.ceil(
    (endDate.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalWeeks = Math.ceil(totalDays / 7);

  for (let week = 0; week < totalWeeks; week++) {
    const weekDates: (Date | null)[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(firstSunday);
      date.setDate(firstSunday.getDate() + week * 7 + day);

      // 선택한 년도보다 이전이거나 오늘을 넘으면 null 또는 중단
      if (date.getFullYear() < year) {
        weekDates.push(null);
      } else if (date > endDate) {
        break;
      } else {
        weekDates.push(date);
      }
    }
    if (weekDates.length > 0) {
      weeks.push(weekDates);
    }
  }

  return weeks;
};

export const ActivityGraph = ({ userId }: EmotionActivityGraphProps) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: activities = [] } = useQuery(
    articleQueries.emotionActivity(userId),
  );

  // 활동 데이터를 Map으로 변환
  const activityMap = new Map(
    activities.map((a) => [
      a.date,
      { emotionLevel: a.emotionLevel, count: a.count },
    ]),
  );

  // 사용 가능한 년도 목록 생성 (가입 년도부터 현재까지)
  const availableYears = Array.from(
    { length: currentYear - 2024 + 1 },
    (_, i) => 2024 + i,
  ).reverse();

  // 주 단위 데이터 생성
  const weeks = generateWeeksData(selectedYear);

  // 월 레이블 생성
  const monthLabels: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const firstDate = week.find((d) => d !== null);
      if (firstDate) {
        const month = firstDate.getMonth();

        if (month !== lastMonth) {
          monthLabels.push({
            month: firstDate.toLocaleDateString("ko-KR", { month: "short" }),
            weekIndex,
          });
          lastMonth = month;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>감정 한눈에 보기</CardTitle>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-4">
        <ScrollArea className="w-full">
          <TooltipProvider delayDuration={0} skipDelayDuration={0}>
            <div className="inline-flex min-w-full flex-col gap-2">
              {/* 월 레이블 */}
              <div className="relative flex h-4 gap-[3px] pl-8 text-muted-foreground text-xs">
                {monthLabels.map(({ month, weekIndex }) => (
                  <div
                    key={`${month}-${weekIndex}`}
                    className="absolute"
                    style={{
                      left: `${32 + weekIndex * 16}px`,
                    }}
                  >
                    {month}
                  </div>
                ))}
              </div>

              {/* 그래프 */}
              <div className="flex gap-2">
                {/* 요일 레이블 */}
                <div className="flex flex-col justify-around pr-2 text-muted-foreground text-xs">
                  <div className="h-[13px]" />
                  <div className="h-[13px] leading-[13px]">월</div>
                  <div className="h-[13px]" />
                  <div className="h-[13px] leading-[13px]">수</div>
                  <div className="h-[13px]" />
                  <div className="h-[13px] leading-[13px]">금</div>
                  <div className="h-[13px]" />
                </div>

                {/* 잔디밭 그리드 */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const date = week[dayIndex] ?? null;

                        if (!date) {
                          return (
                            <div
                              key={`empty-${weekIndex}-${dayIndex}`}
                              className="h-[13px] w-[13px]"
                            />
                          );
                        }

                        const dateString = date.toISOString().split("T")[0];
                        const data = activityMap.get(dateString);
                        const emotionLevel = data?.emotionLevel || null;
                        const count = data?.count || 0;

                        return (
                          <Tooltip key={dateString} delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div
                                className={`h-[13px] w-[13px] cursor-pointer rounded-sm border border-transparent transition-all hover:border-foreground/20 ${getEmotionColor(emotionLevel)}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              onPointerEnter={(e) => {
                                e.currentTarget.style.pointerEvents = "none";
                              }}
                            >
                              <div className="text-xs">
                                <p className="font-semibold">{dateString}</p>
                                {count > 0 ? (
                                  <>
                                    <p>게시글 {count}개</p>
                                    <p>평균 감정: {emotionLevel}/5</p>
                                  </>
                                ) : (
                                  <p>작성한 글 없음</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TooltipProvider>
          <Spacer />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="mt-2 flex items-center justify-end gap-2 text-muted-foreground text-xs">
          <span>낮음</span>
          <div className="flex gap-[3px]">
            <div className="h-[13px] w-[13px] rounded-sm bg-muted" />
            <div className="h-[13px] w-[13px] rounded-sm bg-red-400" />
            <div className="h-[13px] w-[13px] rounded-sm bg-orange-400" />
            <div className="h-[13px] w-[13px] rounded-sm bg-yellow-400" />
            <div className="h-[13px] w-[13px] rounded-sm bg-green-400" />
            <div className="h-[13px] w-[13px] rounded-sm bg-green-500" />
          </div>
          <span>높음</span>
        </div>
      </CardContent>
    </Card>
  );
};

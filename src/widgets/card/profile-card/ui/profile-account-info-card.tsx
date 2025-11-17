import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

type ProfileAccountInfoCardProps = {
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
};

export const ProfileAccountInfoCard = ({
  createdAt,
  updatedAt,
}: ProfileAccountInfoCardProps) => {
  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-5" />
          계정 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">가입일</span>
          <span className="font-medium">{formatDate(createdAt)}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">마지막 업데이트</span>
          <span className="font-medium">{formatDate(updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Mail, User } from "lucide-react";
import { userQueries } from "@/entities/user/api/queries";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { PageContainer } from "@/shared/components/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

type ProfilePageViewProps = {
  id: string;
};

export const ProfilePageView = ({ id }: ProfilePageViewProps) => {
  const { data: user } = useSuspenseQuery(userQueries.getUserInfo(id));

  // 서버 컴포넌트에서 이미 user 존재 여부를 체크했으므로
  // 여기서는 user가 항상 존재함을 보장받음
  if (!user) {
    throw new Error("User should exist at this point");
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PageContainer
      title="프로필"
      description="사용자 정보를 확인하세요"
      className="m-4 flex flex-col gap-2"
    >
      {/* Profile Header Card */}
      <Card className="shadow-none">
        <CardContent className="flex gap-4">
          <UserAvatar
            avatarUrl={user.avatarUrl || undefined}
            fallback={user.userName}
            size="lg"
          />
          <div className="flex-1 space-y-1">
            <CardTitle className="text-2xl">{user.userName}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Mail className="size-4" />
              {user.email}
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      {/* About Me Card */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            소개
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.aboutMe ? (
            <p className="text-sm leading-relaxed">{user.aboutMe}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              아직 소개가 작성되지 않았습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            계정 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">가입일</span>
            <span className="font-medium">{formatDate(user.createdAt)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">마지막 업데이트</span>
            <span className="font-medium">{formatDate(user.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

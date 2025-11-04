"use client";

import { Calendar, Mail, User } from "lucide-react";
import { redirect } from "next/navigation";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";

const Page = () => {
  const { me, isAuthenticated } = useAuth();

  if (!isAuthenticated || !me) {
    redirect(ROUTES.HOME);
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
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <UserAvatar
              avatarUrl={me.avatarUrl || undefined}
              fallback={me.userName}
              size="lg"
            />
            <div className="flex-1 space-y-1">
              <CardTitle className="text-2xl">{me.userName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="size-4" />
                {me.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* About Me Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            소개
          </CardTitle>
        </CardHeader>
        <CardContent>
          {me.aboutMe ? (
            <p className="text-sm leading-relaxed">{me.aboutMe}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              아직 소개가 작성되지 않았습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account Info Card */}
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
            <span className="font-medium">{formatDate(me.createdAt)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">마지막 업데이트</span>
            <span className="font-medium">{formatDate(me.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

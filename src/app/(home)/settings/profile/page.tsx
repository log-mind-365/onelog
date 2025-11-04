"use client";

import { Camera, Mail, Save, User, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { Container } from "@/shared/components/container";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { ROUTES } from "@/shared/model/routes";
import { useAuth } from "@/shared/store/use-auth";

const Page = () => {
  const router = useRouter();
  const { me, isAuthenticated } = useAuth();
  const [userName, setUserName] = useState(me?.userName || "");
  const [aboutMe, setAboutMe] = useState(me?.aboutMe || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || !me) {
    redirect(ROUTES.HOME);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: API 호출 로직 추가

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container.Body>
      <Container.Title
        title="프로필 수정"
        description="프로필 정보를 수정할 수 있습니다"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Card */}
        <Card>
          <CardHeader>
            <CardTitle>프로필 사진</CardTitle>
            <CardDescription>
              프로필 사진을 변경하려면 클릭하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <UserAvatar
                  avatarUrl={me.avatarUrl || undefined}
                  fallback={me.userName}
                  size="xl"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute right-0 bottom-0 rounded-full shadow-md"
                >
                  <Camera className="size-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">
                  JPG, PNG 파일만 가능 (최대 5MB)
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm">
                    사진 업로드
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!me.avatarUrl}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={me.email}
                  disabled
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                이메일은 변경할 수 없습니다
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">사용자 이름</Label>
              <Input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="사용자 이름을 입력하세요"
                maxLength={30}
              />
              <p className="text-muted-foreground text-xs">
                {userName.length}/30
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutMe">소개</Label>
              <Textarea
                id="aboutMe"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="자신을 소개해주세요"
                rows={5}
                maxLength={200}
              />
              <p className="text-muted-foreground text-xs">
                {aboutMe.length}/200
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="mr-2 size-4" />
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 size-4" />
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </Container.Body>
  );
};

export default Page;

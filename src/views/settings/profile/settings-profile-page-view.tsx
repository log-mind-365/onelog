"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Camera, Mail, Save, UserIcon, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { userQueries } from "@/entities/user/api/queries";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { useUpdateProfile } from "@/features/user/lib/use-update-profile";
import { PageContainer } from "@/shared/components/page-container";
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

type SettingsProfilePageViewProps = {
  id: string;
};

export const SettingsProfilePageView = ({
  id,
}: SettingsProfilePageViewProps) => {
  const { data: me } = useSuspenseQuery(userQueries.getUserInfo(id));
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState(me?.userName || "");
  const [aboutMe, setAboutMe] = useState(me?.aboutMe || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  if (!me) {
    redirect(ROUTES.HOME);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB를 초과할 수 없습니다");
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다");
      return;
    }

    setAvatarFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile(
      {
        id: me.id,
        userName,
        aboutMe,
        avatarFile,
        currentAvatarUrl: me.avatarUrl,
      },
      {
        onSuccess: () => {
          router.push(ROUTES.PROFILE.VIEW(me.id));
        },
      },
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const displayAvatarUrl = previewUrl || me.avatarUrl || undefined;

  return (
    <PageContainer
      title="프로필 수정"
      description="프로필 정보를 수정할 수 있습니다"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Card */}
        <Card>
          <CardHeader>
            <CardTitle>프로필 커버 이미지</CardTitle>
            <CardDescription>
              프로필 커버 이미지를 변경하려면 업로드하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-6">
              <div className="relative">
                <UserAvatar
                  avatarUrl={displayAvatarUrl}
                  fallback={me.userName}
                  size="xl"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-md"
                  onClick={handleUploadClick}
                >
                  <Camera className="size-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  JPG, PNG 파일만 가능 (최대 5MB)
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUploadClick}
                  >
                    사진 업로드
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!previewUrl && !me.avatarUrl}
                    onClick={handleDeleteAvatar}
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
              <UserIcon className="size-5" />
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
            disabled={isPending}
          >
            <X className="mr-2 size-4" />
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 size-4" />
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

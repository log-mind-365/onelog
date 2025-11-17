import { useSuspenseQuery } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { userQueries } from "@/entities/user/api/queries";
import { useUpdateProfile } from "@/features/profile/lib/use-update-profile";
import { ROUTES } from "@/shared/model/routes";

export const useSettingsProfilePage = (currentUserId: string) => {
  const { data: me } = useSuspenseQuery(userQueries.getUserInfo(currentUserId));
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

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAboutMe(e.target.value);
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

  return {
    userName,
    aboutMe,
    email: me.email,
    avatarUrl: me.avatarUrl,
    previewUrl,
    displayAvatarUrl,
    isPending,
    fileInputRef,
    onFileChange: handleFileChange,
    onUploadClick: handleUploadClick,
    onDeleteAvatar: handleDeleteAvatar,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onUserNameChange: handleUserNameChange,
    onAboutMeChange: handleAboutMeChange,
  };
};

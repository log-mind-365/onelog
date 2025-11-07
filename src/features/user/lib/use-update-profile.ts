import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserInfo } from "@/entities/user/api/server";
import type { UserInfo } from "@/entities/user/model/types";
import { deleteAvatar, uploadAvatar } from "@/shared/lib/supabase/storage";

type UpdateProfileParams = {
  id: string;
  userName?: string;
  aboutMe?: string;
  avatarFile?: File | null;
  currentAvatarUrl?: string | null;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userName,
      aboutMe,
      avatarFile,
      currentAvatarUrl,
    }: UpdateProfileParams) => {
      let avatarUrl = currentAvatarUrl;

      if (avatarFile) {
        if (currentAvatarUrl) {
          await deleteAvatar(currentAvatarUrl);
        }

        // 새 아바타 업로드
        const { url, error } = await uploadAvatar(id, avatarFile);
        if (error) {
          throw new Error(error);
        }
        avatarUrl = url;
      }

      // DB 업데이트
      return updateUserInfo(id, {
        userName,
        aboutMe,
        avatarUrl: avatarUrl || undefined,
      });
    },
    onSuccess: (data: UserInfo) => {
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      toast.success("프로필이 업데이트되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "프로필 업데이트에 실패했습니다");
    },
  });
};

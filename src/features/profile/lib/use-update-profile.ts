import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteAvatar,
  updateUserInfo,
  uploadAvatar,
} from "@/entities/user/api/server";
import { USER_QUERY_KEY } from "@/entities/user/model/constants";
import type { UserInfo } from "@/entities/user/model/types";
import { useAuth } from "@/features/auth/model/store";

type UpdateProfileParams = {
  id: string;
  userName?: string;
  aboutMe?: string;
  avatarFile?: File | null;
  currentAvatarUrl?: string | null;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setMe } = useAuth();

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
        const url = await uploadAvatar(avatarFile);
        if (!url) {
          throw new Error("아바타 업로드에 실패했습니다");
        }
        if (currentAvatarUrl) {
          try {
            await deleteAvatar(id, currentAvatarUrl);
          } catch (e) {
            console.error(e);
          }
        }
        avatarUrl = url;
      }
      return updateUserInfo(id, {
        userName,
        aboutMe,
        avatarUrl: avatarUrl || undefined,
      });
    },
    onSuccess: (data: UserInfo) => {
      void queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY.INFO,
      });
      setMe(data);
      toast.success("프로필이 업데이트되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "프로필 업데이트에 실패했습니다");
    },
  });
};

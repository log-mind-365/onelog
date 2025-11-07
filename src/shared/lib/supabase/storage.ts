import { supabase } from "@/shared/lib/supabase/client";

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
} as const;

/**
 * Supabase Storage에 파일 업로드
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
): Promise<{ url: string; error?: string }> => {
  try {
    // 파일 업로드 (RLS 정책이 인증을 자동으로 처리)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      console.error("Upload error:", error);

      // RLS 에러 상세 안내
      if (
        error.message.includes("row-level security") ||
        error.message.includes("policy")
      ) {
        return {
          url: "",
          error:
            "파일 업로드 권한이 없습니다. Supabase Dashboard에서 Storage > avatars > Policies 설정을 확인하세요.",
        };
      }

      return { url: "", error: error.message };
    }

    if (!data) {
      return { url: "", error: "업로드 실패: 데이터가 없습니다" };
    }

    // Public URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      url: "",
      error: error instanceof Error ? error.message : "파일 업로드 실패",
    };
  }
};

/**
 * Supabase Storage에서 파일 삭제
 */
export const deleteFile = async (
  bucket: string,
  path: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "파일 삭제 실패",
    };
  }
};

/**
 * 사용자 아바타 업로드
 */
export const uploadAvatar = async (
  userId: string,
  file: File,
): Promise<{ url: string; error?: string }> => {
  // 파일 확장자 추출
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  return uploadFile(STORAGE_BUCKETS.AVATARS, filePath, file);
};

/**
 * URL에서 파일 경로 추출
 */
export const extractPathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.findIndex(
      (part) => part === STORAGE_BUCKETS.AVATARS,
    );
    if (bucketIndex === -1) return null;

    return pathParts.slice(bucketIndex + 1).join("/");
  } catch {
    return null;
  }
};

/**
 * 이전 아바타 삭제
 */
export const deleteAvatar = async (
  avatarUrl: string,
): Promise<{ success: boolean; error?: string }> => {
  const path = extractPathFromUrl(avatarUrl);
  if (!path) {
    return { success: false, error: "Invalid URL" };
  }

  return deleteFile(STORAGE_BUCKETS.AVATARS, path);
};

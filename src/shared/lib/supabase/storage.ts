import { createClient } from "@/shared/lib/supabase/server";

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
): Promise<string> => {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    throw new Error(error.message || "업로드 실패");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Supabase Storage에서 파일 삭제
 */
export const deleteFile = async (bucket: string, path: string) => {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(error.message || "삭제 실패");
  }
};

"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userInfo } from "@/db/schema";
import type {
  UserInfo,
  UserInfoInsertSchema,
} from "@/entities/user/model/types";
import { createClient } from "@/shared/lib/supabase/server";

const STORAGE_BUCKETS = {
  AVATARS: "avatars",
} as const;

export const getUserInfo = async (id: string): Promise<UserInfo | null> => {
  const result = await db
    .select()
    .from(userInfo)
    .where(eq(userInfo.id, id))
    .then((rows) => rows[0]);

  return result || null;
};

export const postUserInfo = async (
  params: UserInfoInsertSchema,
): Promise<UserInfo> => {
  return db
    .insert(userInfo)
    .values(params)
    .returning()
    .then((rows) => rows[0]);
};

export const updateUserInfo = async (
  id: string,
  params: Partial<Omit<UserInfo, "id" | "email" | "createdAt">>,
): Promise<UserInfo> => {
  return db
    .update(userInfo)
    .set({
      ...params,
      updatedAt: new Date(),
    })
    .where(eq(userInfo.id, id))
    .returning()
    .then((rows) => rows[0]);
};

/**
 * Supabase Storage에 파일 업로드
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
): Promise<{ url: string; error?: string }> => {
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

  return { url: publicUrl };
};

/**
 * Supabase Storage에서 파일 삭제
 */
export const deleteFile = async (
  bucket: string,
  path: string,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(error.message || "삭제 실패");
  }

  return { success: true };
};

/**
 * 사용자 아바타 업로드
 */
export const uploadAvatar = async (
  file: File,
): Promise<{ url: string; error?: string }> => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error(error?.message ?? "로그인이 필요합니다.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  return uploadFile(STORAGE_BUCKETS.AVATARS, filePath, file);
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

/**
 * URL에서 파일 경로 추출
 */
const extractPathFromUrl = (url: string): string | null => {
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

"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schemas/profiles";
import type {
  UserInfo,
  UserInfoInsertSchema,
} from "@/entities/user/model/types";
import { createClient } from "@/shared/lib/supabase/server";
import {
  deleteFile,
  STORAGE_BUCKETS,
  uploadFile,
} from "@/shared/lib/supabase/storage";

export const getUserInfo = async (
  id: string | null,
): Promise<UserInfo | null> => {
  if (!id) return null;

  return db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .then((rows) => rows[0]);
};

export const postUserInfo = async (
  params: UserInfoInsertSchema,
): Promise<UserInfo> => {
  return db
    .insert(profiles)
    .values(params)
    .returning()
    .then((rows) => rows[0]);
};

export const updateUserInfo = async (
  id: string,
  params: Partial<Omit<UserInfo, "id" | "email" | "createdAt">>,
): Promise<UserInfo> => {
  return db
    .update(profiles)
    .set({
      ...params,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, id))
    .returning()
    .then((rows) => rows[0]);
};

/**
 * 사용자 아바타 업로드
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error(error?.message ?? "로그인이 필요합니다.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `avatar-${Date.now()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  return uploadFile(STORAGE_BUCKETS.AVATARS, filePath, file);
};

/**
 * 이전 아바타 삭제
 */
export const deleteAvatar = async (userId: string, avatarUrl: string) => {
  const fileName = avatarUrl.split("/").pop();
  const path = `${userId}/${fileName}`;
  await deleteFile(STORAGE_BUCKETS.AVATARS, path);
};

"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userInfo } from "@/db/schema";
import type {
  UserInfo,
  UserInfoInsertSchema,
} from "@/entities/user/model/types";

export const getUserInfo = async (id: string): Promise<UserInfo> => {
  return db
    .select()
    .from(userInfo)
    .where(eq(userInfo.id, id))
    .then((rows) => rows[0]);
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

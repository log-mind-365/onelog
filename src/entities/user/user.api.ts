"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userInfo } from "@/db/schema";
import type { UserInfo } from "@/entities/user/user.model";

export const getUserInfo = async (id: string): Promise<UserInfo> => {
  return db
    .select()
    .from(userInfo)
    .where(eq(userInfo.id, id))
    .then((rows) => rows[0]);
};

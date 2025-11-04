"use server";

import type { User } from "@supabase/auth-js";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userInfo } from "@/db/schema";
import type {
  UserInfo,
  UserInfoInsertSchema,
} from "@/entities/user/model/types";
import { createClient } from "@/shared/lib/supabase/server";

type SignInParams = {
  email: string;
  password: string;
};
type SignUpParams = SignInParams & {
  userName: string;
};

export const signIn = async ({ email, password }: SignInParams) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "로그인에 실패했습니다.");
  }
  return data.user;
};

export const signUp = async ({
  email,
  password,
  userName,
}: SignUpParams): Promise<User | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: userName,
      },
    },
  });

  if (error) {
    throw new Error(error.message || "회원가입에 실패했습니다.");
  }
  return data.user;
};

export const signOut = async (): Promise<void> => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || "로그아웃에 실패했습니다.");
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-storage");
  }
};

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

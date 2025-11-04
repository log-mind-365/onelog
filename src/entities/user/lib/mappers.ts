import type { User } from "@supabase/auth-js";
import type { UserInfo } from "@/entities/user/model/types";

export const signInToEntity = (user: User): UserInfo => {
  return {
    id: user.id,
    email: user.email!,
    userName: user.user_metadata.username,
    avatarUrl: user.user_metadata.avatar,
    aboutMe: user.user_metadata.about_me,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || Date.now()),
  };
};

export const signUpToEntity = (user: User | null): UserInfo | null => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email!,
    userName: user.user_metadata.username,
    avatarUrl: user.user_metadata.avatar,
    aboutMe: user.user_metadata.about_me,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || Date.now()),
  };
};

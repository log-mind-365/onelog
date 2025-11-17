import type { User } from "@supabase/auth-js";
import { supabase } from "@/shared/lib/supabase/client";

type SignInParams = {
  email: string;
  password: string;
};
type SignUpParams = SignInParams & {
  userName: string;
};

export const signIn = async ({ email, password }: SignInParams) => {
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
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || "로그아웃에 실패했습니다.");
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-storage");
  }
};

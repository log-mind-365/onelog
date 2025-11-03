import type { User } from "@supabase/auth-js";
import { supabase } from "@/shared/lib/supabase/create-browser-client";

type SignInParams = {
  email: string;
  password: string;
};
type SignUpParams = SignInParams & {
  userName: string;
};

export const authApi = {
  signIn: async ({ email, password }: SignInParams): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  },

  signUp: async ({
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

    if (error) throw error;
    return data.user;
  },

  signOut: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
    }
  },
};

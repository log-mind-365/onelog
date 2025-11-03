import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo } from "@/entities/user/user.model";

type MeState = {
  me: UserInfo | null;
  isAuthenticated: boolean;
  setMe: (me: UserInfo | null) => void;
  clearMe: () => void;
};

export const useMe = create<MeState>()(
  persist(
    (set) => ({
      me: null,
      isAuthenticated: false,
      setMe: (me) => set({ me, isAuthenticated: true }),
      clearMe: () => set({ me: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);

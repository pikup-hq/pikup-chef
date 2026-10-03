import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import type { UserInfo } from "@/types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

interface AuthState {
  hydrated: boolean;
  token: string;
  userInfo: UserInfo | null;
  hydrate: () => Promise<void>;
  setSession: (token: string, userInfo: UserInfo) => Promise<void>;
  updateUser: (patch: Partial<UserInfo>) => Promise<void>;
  logout: () => Promise<void>;
}

const parseUser = (raw: string | null): UserInfo | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && parsed._id ? parsed : null;
  } catch {
    return null;
  }
};

const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  token: "",
  userInfo: null,

  hydrate: async () => {
    try {
      const [token, user] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      const userInfo = parseUser(user);
      set({
        token: token && userInfo ? token : "",
        userInfo: token ? userInfo : null,
        hydrated: true,
      });
    } catch (e) {
      console.log("Error while restoring session", e);
      set({ hydrated: true });
    }
  },

  setSession: async (token, userInfo) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(userInfo)),
    ]);
    set({ token, userInfo });
  },

  updateUser: async (patch) => {
    const current = get().userInfo;
    if (!current) return;
    const next = { ...current, ...patch };
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(next));
    set({ userInfo: next });
  },

  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    set({ token: "", userInfo: null });
  },
}));

export const isProfileComplete = (user: UserInfo | null) =>
  !!user?.moreDetails?.address && !!user?.moreDetails?.city;

export default useAuthStore;

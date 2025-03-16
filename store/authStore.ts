import { create } from "zustand";

interface AuthState {
  userInfo: any;
  token: string;
  setUserInfo: (userInfo: any) => void;
  setToken: (token: string) => void;
  resetAuth: () => void;
}

// Create the store with Zustand
const useAuthStore = create<AuthState>((set) => ({
  userInfo: [],
  token: "",
  setUserInfo: (userInfo) => set({ userInfo }),
  setToken: (token) => set({ token }),
  resetAuth: () => set({ userInfo: [], token: "" }),
}));

export default useAuthStore;

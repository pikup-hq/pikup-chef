import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import { normalizeUser } from "./auth";
import { registerPushToken, unregisterPushToken } from "./notifications";

/** Persist a fresh login and register this device for order alerts. */
export const startSession = async (token: string, rawUser: any) => {
  await useAuthStore.getState().setSession(token, normalizeUser(rawUser));
  registerPushToken();
  useNotificationStore.getState().refreshUnread();
};

export const signOut = async () => {
  await unregisterPushToken();
  useNotificationStore.getState().reset();
  await useAuthStore.getState().logout();
};

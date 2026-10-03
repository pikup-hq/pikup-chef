import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import api from "./api";
import { authApi } from "./auth";
import type { AppNotification } from "@/types";

export const ORDER_CHANNEL_ID = "orders";
export const ORDER_SOUND = "new_order.wav";
export const NEW_ORDER_TYPE = "order_created";
const PUSH_TOKEN_KEY = "deviceToken";

export const notificationsApi = {
  list: (page = 1, limit = 20) =>
    api
      .get("/notification", { params: { page, limit } })
      .then((r) => ({
        data: (r.data.data || []) as AppNotification[],
        pages: (r.data.pagination?.pages || 1) as number,
      })),
  unreadCount: () =>
    api.get("/notification/unread-count").then((r) => (r.data.data?.count || 0) as number),
  markRead: (id: string) => api.patch(`/notification/${id}/read`).then((r) => r.data),
  markAllRead: () => api.post("/notification/mark-all-read").then((r) => r.data),
};

/** Call once at startup, before any notification can arrive. */
export const configureNotifications = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const isNewOrder = notification.request.content.data?.type === NEW_ORDER_TYPE;
      // New orders in the foreground are handled by the in-app alert (looping sound + modal).
      return {
        shouldShowAlert: !isNewOrder,
        shouldPlaySound: !isNewOrder,
        shouldSetBadge: true,
      };
    },
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ORDER_CHANNEL_ID, {
      name: "New orders",
      description: "Rings when a customer places an order",
      importance: Notifications.AndroidImportance.MAX,
      sound: ORDER_SOUND,
      vibrationPattern: [0, 400, 250, 400, 250, 400],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      enableVibrate: true,
    });
    await Notifications.setNotificationChannelAsync("default", {
      name: "General",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
};

const getPushToken = async () => {
  if (!Device.isDevice) {
    console.warn("Push notifications are only supported on physical devices.");
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status !== "granted") return null;

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    console.error("Expo project ID not found.");
    return null;
  }
  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
};

/** Register this device for pushes and tell the API. Safe to call on every launch. */
export const registerPushToken = async () => {
  try {
    const token = await getPushToken();
    if (!token) return null;
    await authApi.saveDeviceToken(token);
    await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
};

/** Stop pushes to this device for the current account (call before clearing the session). */
export const unregisterPushToken = async () => {
  try {
    await authApi.saveDeviceToken(null);
  } catch {
    // Session may already be invalid; nothing else to do.
  }
};

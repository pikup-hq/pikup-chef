import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { ErrorToast } from "@/components/common/Toasts";
import { BASE_URL } from "@/config";

export const registerForPushNotifications = async () => {
  try {
    if (!Device.isDevice) {
      console.warn("Push notifications are only supported on real devices.");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Push notification permission denied.");
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      console.error("Expo Project ID not found.");
      return null;
    }

    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log("Device Token Generated:", pushTokenData.data);
    return pushTokenData.data;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
};

const sendPushTokenToBackend = async (pushToken: string) => {
  let token = await SecureStore.getItemAsync("token");

  try {
    const response = await fetch(`${BASE_URL}/auth/save-device-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pushToken }),
    });

    if (!response.ok) {
      ErrorToast("Failed to save push token");
    }

    const data = await response.json();
    console.log("Push token saved:", data);
  } catch (error) {
    console.error("Error sending push token to backend:", error);
  }
};

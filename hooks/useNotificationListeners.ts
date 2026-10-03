import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import { NEW_ORDER_TYPE } from "@/services/notifications";

const orderTarget = (data: Record<string, any> = {}) =>
  data.orderObjectId || data.relatedEntity || data.orderId;

// The last response survives re-renders/re-logins; only act on each one once.
let lastHandledId: string | null = null;

const openFromNotification = (response: Notifications.NotificationResponse) => {
  const id = response.notification.request.identifier;
  if (id === lastHandledId) return;
  lastHandledId = id;
  const data = response.notification.request.content.data || {};
  useNotificationStore.getState().dismissOrderAlert();
  const target = orderTarget(data);
  if (target && (data.type === NEW_ORDER_TYPE || data.orderId)) {
    router.push({ pathname: "/orderDetail", params: { id: String(target) } });
  } else if (data.type === "wallet_credit" || data.type === "withdrawal_update") {
    router.push("/(tabs)/wallet");
  } else {
    router.push("/notifications");
  }
};

/** Wire push notifications to the in-app alert, unread badge and deep links. */
export const useNotificationListeners = () => {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;

    const received = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body, data = {} } = notification.request.content;
      const store = useNotificationStore.getState();
      store.refreshUnread();
      if (data.type === NEW_ORDER_TYPE) {
        store.showOrderAlert({
          orderId: String(data.orderId || ""),
          orderObjectId: data.orderObjectId ? String(data.orderObjectId) : undefined,
          title: title || "New order received",
          message: body || `Order #${data.orderId}`,
        });
      }
    });

    const responded = Notifications.addNotificationResponseReceivedListener(openFromNotification);

    // App was launched by tapping a notification.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) openFromNotification(response);
    });

    return () => {
      received.remove();
      responded.remove();
    };
  }, [token]);
};
